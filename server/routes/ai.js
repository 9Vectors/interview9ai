const express = require('express');
const authMiddleware = require('../middleware/auth');
const aiService = require('../services/aiService');
const candidateRepository = require('../repositories/candidateRepository');
const scoreRepository = require('../repositories/scoreRepository');
const interviewRepository = require('../repositories/interviewRepository');
const router = express.Router();

// Apply auth middleware to all AI routes
router.use(authMiddleware);

// POST /api/v1/ai/analyze
router.post('/analyze', async (req, res) => {
  try {
    if (!aiService.client) {
      return res.status(503).json({
        success: false,
        error: { code: 'AI_UNAVAILABLE', message: 'ANTHROPIC_API_KEY is not configured. AI analysis unavailable.' },
      });
    }

    const { candidateId } = req.body;
    if (!candidateId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'candidateId is required' },
      });
    }

    // Gather candidate data + scores + interviews for context
    const candidate = await candidateRepository.findById(req.orgId, candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Candidate not found' },
      });
    }

    const { data: scores } = await scoreRepository.findAll(req.orgId, { candidateId });
    const { data: interviews } = await interviewRepository.findAll(req.orgId, { candidateId });

    const context = {
      orgName: req.user.org_name || req.orgId,
      userRole: req.user.role || 'Interviewer',
    };

    const analysisData = {
      candidate,
      scores,
      interviews,
      analysisType: 'candidate_analysis',
    };

    const rawResult = await aiService.analyze(context, analysisData);

    // Parse structured result if possible, otherwise wrap as text
    let analysis;
    try {
      analysis = typeof rawResult === 'string' ? JSON.parse(rawResult) : rawResult;
    } catch {
      analysis = { rawAnalysis: rawResult };
    }

    const result = {
      candidateId,
      orgId: req.orgId,
      type: 'candidate_analysis',
      ...analysis,
      timestamp: new Date().toISOString(),
    };

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('AI analyze error:', error.message);
    res.status(500).json({
      success: false,
      error: { code: 'AI_ERROR', message: 'AI analysis failed' },
    });
  }
});

// POST /api/v1/ai/generate
router.post('/generate', async (req, res) => {
  try {
    if (!aiService.client) {
      return res.status(503).json({
        success: false,
        error: { code: 'AI_UNAVAILABLE', message: 'ANTHROPIC_API_KEY is not configured. AI generation unavailable.' },
      });
    }

    const { roleLevel, focusAreas, candidateId } = req.body;
    if (!roleLevel) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'roleLevel is required' },
      });
    }

    const context = {
      orgName: req.user.org_name || req.orgId,
      userRole: req.user.role || 'Interviewer',
    };

    const generateData = {
      roleLevel,
      focusAreas: focusAreas || [],
      candidateId,
      requestType: 'interview_plan_generation',
    };

    const rawResult = await aiService.generate(context, generateData);

    let guide;
    try {
      guide = typeof rawResult === 'string' ? JSON.parse(rawResult) : rawResult;
    } catch {
      guide = { rawPlan: rawResult };
    }

    const result = {
      roleLevel,
      orgId: req.orgId,
      ...guide,
      timestamp: new Date().toISOString(),
    };

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('AI generate error:', error.message);
    res.status(500).json({
      success: false,
      error: { code: 'AI_ERROR', message: 'AI generation failed' },
    });
  }
});

// POST /api/v1/ai/recommend
router.post('/recommend', async (req, res) => {
  try {
    if (!aiService.client) {
      return res.status(503).json({
        success: false,
        error: { code: 'AI_UNAVAILABLE', message: 'ANTHROPIC_API_KEY is not configured. AI recommendations unavailable.' },
      });
    }

    const { candidateId } = req.body;
    if (!candidateId) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'candidateId is required' },
      });
    }

    // Gather full candidate context
    const candidate = await candidateRepository.findById(req.orgId, candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Candidate not found' },
      });
    }

    const { data: scores } = await scoreRepository.findAll(req.orgId, { candidateId });
    const { data: interviews } = await interviewRepository.findAll(req.orgId, { candidateId });

    const context = {
      orgName: req.user.org_name || req.orgId,
      userRole: req.user.role || 'Interviewer',
    };

    const recommendData = {
      candidate,
      scores,
      interviews,
      requestType: 'hiring_recommendation',
    };

    const rawResult = await aiService.recommend(context, recommendData);

    let recommendations;
    try {
      recommendations = typeof rawResult === 'string' ? JSON.parse(rawResult) : rawResult;
    } catch {
      recommendations = { rawRecommendation: rawResult };
    }

    const result = {
      candidateId,
      orgId: req.orgId,
      ...recommendations,
      timestamp: new Date().toISOString(),
    };

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('AI recommend error:', error.message);
    res.status(500).json({
      success: false,
      error: { code: 'AI_ERROR', message: 'AI recommendation failed' },
    });
  }
});

module.exports = router;
