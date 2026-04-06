const BaseRepository = require('./baseRepository');

class ScoreRepository extends BaseRepository {
  constructor() {
    super('scores');
  }

  /**
   * Create a STAR score or M13 attribute rating.
   */
  async create(orgId, scoreData) {
    const score = {
      ...scoreData,
      type: scoreData.type || 'star', // 'star' | 'm13'
    };
    return super.create(orgId, score);
  }

  /**
   * Find scores for a specific candidate and/or interview.
   */
  async findAll(orgId, { candidateId, interviewId, type, page = 1, limit = 100 } = {}) {
    const filterFn = (s) => {
      if (candidateId && s.candidateId !== candidateId) return false;
      if (interviewId && s.interviewId !== interviewId) return false;
      if (type && s.type !== type) return false;
      return true;
    };

    return super.findAll(orgId, { filterFn, page, limit });
  }
}

module.exports = new ScoreRepository();
