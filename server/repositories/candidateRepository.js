const BaseRepository = require('./baseRepository');

class CandidateRepository extends BaseRepository {
  constructor() {
    super('candidates');
  }

  /**
   * Create a new candidate with default scoring structure.
   */
  async create(orgId, candidateData) {
    const candidate = {
      ...candidateData,
      status: candidateData.status || 'screening',
      stage: candidateData.stage || 'New',
      roleLevel: candidateData.roleLevel || 'individual',
      appliedDate: candidateData.appliedDate || new Date().toISOString().split('T')[0],
      scores: candidateData.scores || { overall: 0, culture: 0, technical: 0, leadership: 0 },
      interviewCount: candidateData.interviewCount || 0,
    };
    return super.create(orgId, candidate);
  }

  /**
   * Find all candidates with optional filters: status, roleLevel, search text.
   */
  async findAll(orgId, { status, roleLevel, search, page = 1, limit = 20 } = {}) {
    const filterFn = (c) => {
      if (status && c.status !== status) return false;
      if (roleLevel && c.roleLevel !== roleLevel) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !(c.name || '').toLowerCase().includes(q) &&
          !(c.role || '').toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    };

    return super.findAll(orgId, { filterFn, page, limit });
  }

  /**
   * Soft delete — sets status to 'archived'.
   */
  async delete(orgId, id) {
    return this.update(orgId, id, { status: 'archived', _status: 'archived' });
  }
}

module.exports = new CandidateRepository();
