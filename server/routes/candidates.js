const express = require('express');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Apply auth middleware to all candidate routes
router.use(authMiddleware);

// In-memory store (replace with database in production)
let candidates = [
  {
    id: 'C001',
    name: 'Sarah Chen',
    role: 'VP of Engineering',
    roleLevel: 'senior',
    status: 'interviewing',
    stage: 'Technical',
    appliedDate: '2026-01-15',
    scores: { overall: 4.2, culture: 4.5, technical: 4.0, leadership: 4.1 },
    interviewCount: 2,
    orgId: 'org-001',
  },
];

// GET /api/v1/candidates
router.get('/', (req, res) => {
  const { status, roleLevel, search, page = 1, limit = 20 } = req.query;

  // Org-scoped: only return candidates belonging to the user's org
  let result = candidates.filter((c) => c.orgId === req.orgId);

  if (status) result = result.filter((c) => c.status === status);
  if (roleLevel) result = result.filter((c) => c.roleLevel === roleLevel);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q));
  }

  const total = result.length;
  const start = (page - 1) * limit;
  result = result.slice(start, start + Number(limit));

  res.json({
    success: true,
    data: result,
    meta: { pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) } },
  });
});

// GET /api/v1/candidates/:id
router.get('/:id', (req, res) => {
  // Org-scoped lookup
  const candidate = candidates.find((c) => c.id === req.params.id && c.orgId === req.orgId);
  if (!candidate) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Candidate not found' } });
  }
  res.json({ success: true, data: candidate });
});

// POST /api/v1/candidates
router.post('/', (req, res) => {
  const { name, role, roleLevel } = req.body;
  if (!name || !role) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Name and role are required' } });
  }

  const candidate = {
    id: `C${String(candidates.length + 1).padStart(3, '0')}`,
    name,
    role,
    roleLevel: roleLevel || 'individual',
    status: 'screening',
    stage: 'New',
    appliedDate: new Date().toISOString().split('T')[0],
    scores: { overall: 0, culture: 0, technical: 0, leadership: 0 },
    interviewCount: 0,
    // Org comes from JWT, never from client
    orgId: req.orgId,
  };

  candidates.push(candidate);
  res.status(201).json({ success: true, data: candidate });
});

// PUT /api/v1/candidates/:id
router.put('/:id', (req, res) => {
  // Org-scoped: can only update candidates in own org
  const index = candidates.findIndex((c) => c.id === req.params.id && c.orgId === req.orgId);
  if (index === -1) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Candidate not found' } });
  }

  // Prevent client from overriding orgId
  const { orgId: _discard, ...updateData } = req.body;
  candidates[index] = { ...candidates[index], ...updateData };
  res.json({ success: true, data: candidates[index] });
});

// DELETE /api/v1/candidates/:id (soft delete)
router.delete('/:id', (req, res) => {
  // Org-scoped
  const index = candidates.findIndex((c) => c.id === req.params.id && c.orgId === req.orgId);
  if (index === -1) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Candidate not found' } });
  }

  candidates[index].status = 'rejected';
  res.status(204).send();
});

module.exports = router;
