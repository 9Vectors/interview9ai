const BaseRepository = require('./baseRepository');

class ReferenceRepository extends BaseRepository {
  constructor() {
    super('references');
  }

  /**
   * Create a reference check record.
   */
  async create(orgId, refData) {
    const reference = {
      ...refData,
      status: refData.status || 'pending', // pending | completed | flagged
    };
    return super.create(orgId, reference);
  }

  /**
   * Find references for a candidate.
   */
  async findAll(orgId, { candidateId, status, page = 1, limit = 50 } = {}) {
    const filterFn = (r) => {
      if (candidateId && r.candidateId !== candidateId) return false;
      if (status && r.status !== status) return false;
      return true;
    };

    return super.findAll(orgId, { filterFn, page, limit });
  }
}

module.exports = new ReferenceRepository();
