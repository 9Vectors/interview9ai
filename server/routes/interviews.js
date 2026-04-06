const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Apply auth middleware to all interview routes
router.use(authMiddleware);

let interviews = [];

// GET /api/v1/interviews
router.get('/', (req, res) => {
  const { candidateId } = req.query;
  // Org-scoped: only return interviews belonging to the user's org
  let result = interviews.filter((i) => i.orgId === req.orgId);
  if (candidateId) result = result.filter((i) => i.candidateId === candidateId);
  res.json({ success: true, data: result });
});

// POST /api/v1/interviews
router.post('/', (req, res) => {
  const { orgId: _discard, ...body } = req.body;
  const interview = {
    id: `INT${String(interviews.length + 1).padStart(3, '0')}`,
    ...body,
    // Org comes from JWT, never from client
    orgId: req.orgId,
    createdBy: req.user.sub || req.user.id,
    createdAt: new Date().toISOString(),
  };
  interviews.push(interview);
  res.status(201).json({ success: true, data: interview });
});

module.exports = router;
