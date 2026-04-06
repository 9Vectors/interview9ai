const express = require('express');
const authMiddleware = require('../middleware/auth');
const interviewRepository = require('../repositories/interviewRepository');
const router = express.Router();

// Apply auth middleware to all interview routes
router.use(authMiddleware);

// GET /api/v1/interviews
router.get('/', async (req, res, next) => {
  try {
    const { candidateId, status, page = 1, limit = 50 } = req.query;

    const result = await interviewRepository.findAll(req.orgId, {
      candidateId,
      status,
      page: Number(page),
      limit: Number(limit),
    });

    res.json({ success: true, data: result.data, meta: { total: result.total } });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/interviews/:id
router.get('/:id', async (req, res, next) => {
  try {
    const interview = await interviewRepository.findById(req.orgId, req.params.id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Interview not found' },
      });
    }
    res.json({ success: true, data: interview });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/interviews
router.post('/', async (req, res, next) => {
  try {
    const { orgId: _discard, ...body } = req.body;

    const interview = await interviewRepository.create(req.orgId, {
      ...body,
      createdBy: req.user.sub || req.user.id,
    });

    res.status(201).json({ success: true, data: interview });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/interviews/:id
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await interviewRepository.update(req.orgId, req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Interview not found' },
      });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/interviews/:id (soft delete)
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await interviewRepository.delete(req.orgId, req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Interview not found' },
      });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
