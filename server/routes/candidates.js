const express = require('express');
const authMiddleware = require('../middleware/auth');
const candidateRepository = require('../repositories/candidateRepository');
const router = express.Router();

// Apply auth middleware to all candidate routes
router.use(authMiddleware);

// GET /api/v1/candidates
router.get('/', async (req, res, next) => {
  try {
    const { status, roleLevel, search, page = 1, limit = 20 } = req.query;

    const result = await candidateRepository.findAll(req.orgId, {
      status,
      roleLevel,
      search,
      page: Number(page),
      limit: Number(limit),
    });

    res.json({
      success: true,
      data: result.data,
      meta: {
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/candidates/:id
router.get('/:id', async (req, res, next) => {
  try {
    const candidate = await candidateRepository.findById(req.orgId, req.params.id);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Candidate not found' },
      });
    }
    res.json({ success: true, data: candidate });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/candidates
router.post('/', async (req, res, next) => {
  try {
    const { name, role, roleLevel } = req.body;
    if (!name || !role) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Name and role are required' },
      });
    }

    const candidate = await candidateRepository.create(req.orgId, {
      name,
      role,
      roleLevel,
    });

    res.status(201).json({ success: true, data: candidate });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/candidates/:id
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await candidateRepository.update(req.orgId, req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Candidate not found' },
      });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/candidates/:id (soft delete)
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await candidateRepository.delete(req.orgId, req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Candidate not found' },
      });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
