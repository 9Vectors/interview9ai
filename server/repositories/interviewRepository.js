const BaseRepository = require('./baseRepository');

class InterviewRepository extends BaseRepository {
  constructor() {
    super('interviews');
  }

  /**
   * Create a new interview session.
   */
  async create(orgId, interviewData) {
    const interview = {
      ...interviewData,
      status: interviewData.status || 'scheduled',
    };
    return super.create(orgId, interview);
  }

  /**
   * Find all interviews for an org, optionally filtered by candidateId.
   */
  async findAll(orgId, { candidateId, status, page = 1, limit = 50 } = {}) {
    const filterFn = (i) => {
      if (candidateId && i.candidateId !== candidateId) return false;
      if (status && i.status !== status) return false;
      return true;
    };

    return super.findAll(orgId, { filterFn, page, limit });
  }
}

module.exports = new InterviewRepository();
