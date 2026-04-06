const BaseRepository = require('./baseRepository');

class HiringProcessRepository extends BaseRepository {
  constructor() {
    super('hiringProcesses');
  }

  /**
   * Create a hiring process definition.
   */
  async create(orgId, processData) {
    const process = {
      ...processData,
      status: processData.status || 'active',
      stages: processData.stages || [],
    };
    return super.create(orgId, process);
  }

  /**
   * Find all hiring processes, optionally filtered by status.
   */
  async findAll(orgId, { status, page = 1, limit = 50 } = {}) {
    const filterFn = (p) => {
      if (status && p.status !== status) return false;
      return true;
    };

    return super.findAll(orgId, { filterFn, page, limit });
  }
}

module.exports = new HiringProcessRepository();
