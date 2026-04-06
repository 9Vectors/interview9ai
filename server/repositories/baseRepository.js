const { v4: uuidv4 } = require('uuid');
const { getDatabase, isCosmosAvailable } = require('../db/cosmosClient');

/**
 * Base repository with Cosmos DB persistence + in-memory fallback.
 * All queries are org-scoped via partition key.
 */
class BaseRepository {
  constructor(containerName) {
    this.containerName = containerName;
    this._memoryStore = [];
  }

  _getContainer() {
    const db = getDatabase();
    if (!db) return null;
    return db.container(this.containerName);
  }

  /**
   * Create a new document.
   */
  async create(orgId, data) {
    const doc = {
      id: data.id || uuidv4(),
      ...data,
      orgId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _status: 'active',
    };

    const container = this._getContainer();
    if (container) {
      const { resource } = await container.items.create(doc);
      return resource;
    }

    // In-memory fallback
    this._memoryStore.push(doc);
    return doc;
  }

  /**
   * Find a single document by id within an org.
   */
  async findById(orgId, id) {
    const container = this._getContainer();
    if (container) {
      try {
        const { resource } = await container.item(id, orgId).read();
        if (resource && resource._status !== 'archived') return resource;
        return null;
      } catch (err) {
        if (err.code === 404) return null;
        throw err;
      }
    }

    // In-memory fallback
    return this._memoryStore.find(
      (d) => d.id === id && d.orgId === orgId && d._status !== 'archived'
    ) || null;
  }

  /**
   * Find all documents for an org, with optional filter function.
   */
  async findAll(orgId, { filterFn, page = 1, limit = 50 } = {}) {
    const container = this._getContainer();

    if (container) {
      let query = `SELECT * FROM c WHERE c.orgId = @orgId AND (NOT IS_DEFINED(c._status) OR c._status != 'archived')`;
      const parameters = [{ name: '@orgId', value: orgId }];

      const { resources } = await container.items
        .query({ query, parameters })
        .fetchAll();

      let results = resources;
      if (filterFn) results = results.filter(filterFn);

      const total = results.length;
      const start = (page - 1) * limit;
      const paged = results.slice(start, start + Number(limit));

      return { data: paged, total, page: Number(page), limit: Number(limit) };
    }

    // In-memory fallback
    let results = this._memoryStore.filter(
      (d) => d.orgId === orgId && d._status !== 'archived'
    );
    if (filterFn) results = results.filter(filterFn);

    const total = results.length;
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + Number(limit));

    return { data: paged, total, page: Number(page), limit: Number(limit) };
  }

  /**
   * Partial update of a document.
   */
  async update(orgId, id, updates) {
    const container = this._getContainer();

    // Strip orgId from updates to prevent tenant override
    const { orgId: _discard, id: _discardId, ...safeUpdates } = updates;

    if (container) {
      const existing = await this.findById(orgId, id);
      if (!existing) return null;

      const updated = {
        ...existing,
        ...safeUpdates,
        updatedAt: new Date().toISOString(),
      };

      const { resource } = await container.item(id, orgId).replace(updated);
      return resource;
    }

    // In-memory fallback
    const index = this._memoryStore.findIndex(
      (d) => d.id === id && d.orgId === orgId && d._status !== 'archived'
    );
    if (index === -1) return null;

    this._memoryStore[index] = {
      ...this._memoryStore[index],
      ...safeUpdates,
      updatedAt: new Date().toISOString(),
    };
    return this._memoryStore[index];
  }

  /**
   * Soft delete — sets _status to 'archived'.
   */
  async delete(orgId, id) {
    return this.update(orgId, id, { _status: 'archived' });
  }
}

module.exports = BaseRepository;
