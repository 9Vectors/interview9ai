const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Apply auth middleware to all AI routes
router.use(authMiddleware);

// POST /api/v1/ai/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { candidateId } = req.body;

    // In production, this calls Claude API via AIService
    // For now, return mock analysis scoped to org
    const analysis = {
      candidateId,
      orgId: req.orgId,
      type: 'candidate_analysis',
      vectorScores: {
        V2: { score: 4.2, subVectors: { 'Employee Characteristics': 4.3, Leadership: 4.1, Culture: 4.5 } },
        V6: { score: 3.8, subVectors: { Performance: 3.9, Measurement: 3.7 } },
      },
      measurement13: {
        topAttributes: [
          { id: 8, name: 'Emotional Intelligence', score: 4.5 },
          { id: 6, name: 'Accountability', score: 4.3 },
          { id: 10, name: 'Results Orientation', score: 4.0 },
        ],
        gapAttributes: [
          { id: 1, name: 'Vision', score: 3.0, recommendation: 'Assess strategic vision through senior management questions (Ch. 11)' },
        ],
      },
      recommendations: [
        'Strong cultural fit candidate — V2 Culture scores above threshold',
        'Recommend additional strategic thinking assessment before VP-level placement',
        'Reference check triangulation shows 0 validation gaps — high confidence',
      ],
      redFlags: [],
      timestamp: new Date().toISOString(),
    };

    res.json({ success: true, data: analysis });
  } catch (error) {
    console.error('AI analyze error:', error.message);
    res.status(500).json({ success: false, error: { code: 'AI_ERROR', message: 'AI analysis failed' } });
  }
});

// POST /api/v1/ai/generate
router.post('/generate', async (req, res) => {
  try {
    const { roleLevel, focusAreas } = req.body;

    const guide = {
      roleLevel,
      orgId: req.orgId,
      interviewPlan: {
        stages: ['Opening/Rapport', 'Traditional', 'Achievement-Anchored', 'Role-Specific', 'Pressure Cooker', 'Final Round'],
        estimatedDuration: 75,
        questionRecommendations: [
          { stage: 'Traditional', questions: ['Q001', 'Q004'], rationale: 'Build rapport and assess baseline motivation' },
          { stage: 'Achievement-Anchored', questions: ['Q006', 'Q008'], rationale: 'Quantify past impact with STAR framework' },
          { stage: 'Pressure Cooker', questions: ['Q030', 'Q032'], rationale: 'Assess resilience and integrity under pressure' },
          { stage: 'Final Round', questions: ['Q034', 'Q035'], rationale: 'Validate fit and assess 90-day readiness' },
        ],
      },
      timestamp: new Date().toISOString(),
    };

    res.json({ success: true, data: guide });
  } catch (error) {
    console.error('AI generate error:', error.message);
    res.status(500).json({ success: false, error: { code: 'AI_ERROR', message: 'AI generation failed' } });
  }
});

// POST /api/v1/ai/recommend
router.post('/recommend', async (req, res) => {
  try {
    const { candidateId } = req.body;

    const recommendations = {
      candidateId,
      orgId: req.orgId,
      hireRecommendation: 'proceed',
      confidence: 0.82,
      reasoning: [
        'STAR scores consistently above 4.0 across all dimensions',
        'Measurement13 profile shows strong Competence and Character clusters',
        'Reference triangulation validated — 0 discrepancy gaps',
      ],
      nextSteps: [
        'Complete pressure-cooker assessment for Adaptability and Emotional Intelligence',
        'Schedule Culture Agent deep-dive for Values alignment',
        'Prepare offer package aligned to V7 → Employees → Compensation expectations',
      ],
      timestamp: new Date().toISOString(),
    };

    res.json({ success: true, data: recommendations });
  } catch (error) {
    console.error('AI recommend error:', error.message);
    res.status(500).json({ success: false, error: { code: 'AI_ERROR', message: 'AI recommendation failed' } });
  }
});

module.exports = router;
