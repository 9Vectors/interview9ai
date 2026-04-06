const express = require('express');
const aiService = require('../services/aiService');
const candidateRepository = require('../repositories/candidateRepository');
const scoreRepository = require('../repositories/scoreRepository');
const interviewRepository = require('../repositories/interviewRepository');
const router = express.Router();

// Note: auth middleware is not applied here for simplicity in local dev.
// In production, add authMiddleware to protect these endpoints.

// GET /api/v1/reports/candidate/:candidateId — Generate candidate summary report
router.get('/candidate/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Try to load from repository; fallback to basic report if repos unavailable
    let candidate = null;
    let scores = [];
    let interviews = [];

    try {
      const orgId = req.orgId || 'default';
      candidate = await candidateRepository.findById(orgId, candidateId);
      const scoreResult = await scoreRepository.findAll(orgId, { candidateId });
      scores = scoreResult?.data || [];
      const intResult = await interviewRepository.findAll(orgId, { candidateId });
      interviews = intResult?.data || [];
    } catch {
      // Repositories may not be available in local mode
    }

    if (aiService.client) {
      const response = await aiService.client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Generate a candidate summary report as JSON. Return ONLY valid JSON with these fields:
{
  "candidateName": "string",
  "overview": "2-3 paragraph overview of the candidate",
  "scores": { "overall": number, "culture_fit": number, "leadership": number, "technical": number },
  "strengths": ["strength1", "strength2", ...],
  "concerns": ["concern1", ...],
  "recommendation": "Hire/Hold/Decline recommendation with reasoning"
}

Candidate data: ${JSON.stringify(candidate || { id: candidateId })}
Scores: ${JSON.stringify(scores)}
Interviews: ${JSON.stringify(interviews)}`,
        }],
      });

      let data;
      try {
        const raw = response.content[0].text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        data = JSON.parse(raw);
      } catch {
        data = { overview: response.content[0].text, candidateName: candidate?.name || candidateId };
      }

      return res.json({ success: true, data });
    }

    // Fallback without AI
    res.json({
      success: true,
      data: {
        candidateName: candidate?.name || candidateId,
        overview: 'AI service is not configured. Configure ANTHROPIC_API_KEY to generate AI-powered reports.',
        scores: candidate?.scores || { overall: 0, culture_fit: 0, leadership: 0, technical: 0 },
        strengths: ['Data not available without AI'],
        concerns: [],
        recommendation: 'Configure AI to generate recommendations.',
      },
    });
  } catch (error) {
    console.error('Report generation error:', error.message);
    res.status(500).json({
      success: false,
      error: { code: 'REPORT_ERROR', message: 'Failed to generate candidate summary report' },
    });
  }
});

// GET /api/v1/reports/pipeline — Generate pipeline health report
router.get('/pipeline', async (req, res) => {
  try {
    let candidates = [];
    try {
      const orgId = req.orgId || 'default';
      const result = await candidateRepository.findAll(orgId, {});
      candidates = result?.data || [];
    } catch {
      // fallback
    }

    if (aiService.client) {
      const response = await aiService.client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Generate a pipeline health report as JSON. Return ONLY valid JSON:
{
  "summary": "Executive summary of pipeline health",
  "metrics": { "total_candidates": number, "active_pipelines": number, "avg_time_to_fill": "string", "quality_score": "string" },
  "funnel": [{ "stage": "string", "count": number, "conversionRate": number }],
  "bottlenecks": ["bottleneck description", ...],
  "recommendations": ["recommendation", ...]
}

Current candidates data: ${JSON.stringify(candidates.slice(0, 50))}
Total candidates: ${candidates.length}`,
        }],
      });

      let data;
      try {
        const raw = response.content[0].text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        data = JSON.parse(raw);
      } catch {
        data = { summary: response.content[0].text };
      }

      return res.json({ success: true, data });
    }

    // Fallback
    const screening = candidates.filter((c) => c.status === 'screening').length;
    const interviewing = candidates.filter((c) => c.status === 'interviewing').length;
    const offer = candidates.filter((c) => c.status === 'offer').length;
    const rejected = candidates.filter((c) => c.status === 'rejected').length;

    res.json({
      success: true,
      data: {
        summary: 'Pipeline health report generated from local data. Configure ANTHROPIC_API_KEY for AI-enhanced analysis.',
        metrics: {
          total_candidates: candidates.length,
          active_pipelines: interviewing + screening,
          avg_time_to_fill: 'N/A',
          quality_score: 'N/A',
        },
        funnel: [
          { stage: 'Screening', count: screening, conversionRate: candidates.length ? Math.round((screening / candidates.length) * 100) : 0 },
          { stage: 'Interviewing', count: interviewing, conversionRate: screening ? Math.round((interviewing / screening) * 100) : 0 },
          { stage: 'Offer', count: offer, conversionRate: interviewing ? Math.round((offer / interviewing) * 100) : 0 },
          { stage: 'Rejected', count: rejected, conversionRate: 0 },
        ],
        bottlenecks: [],
        recommendations: ['Configure AI service for deeper pipeline analysis'],
      },
    });
  } catch (error) {
    console.error('Pipeline report error:', error.message);
    res.status(500).json({
      success: false,
      error: { code: 'REPORT_ERROR', message: 'Failed to generate pipeline health report' },
    });
  }
});

// GET /api/v1/reports/analysis — Generate interview analysis report
router.get('/analysis', async (req, res) => {
  try {
    let interviews = [];
    try {
      const orgId = req.orgId || 'default';
      const result = await interviewRepository.findAll(orgId, {});
      interviews = result?.data || [];
    } catch {
      // fallback
    }

    if (aiService.client) {
      const response = await aiService.client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Generate an interview analysis report as JSON. Return ONLY valid JSON:
{
  "summary": "Overall analysis of interview process effectiveness",
  "questionEffectiveness": [{ "category": "string", "rating": "high|medium|low", "insight": "string" }],
  "scoringPatterns": "Description of scoring patterns observed",
  "calibrationNotes": "Notes on interviewer calibration and consistency"
}

Interview data: ${JSON.stringify(interviews.slice(0, 30))}
Total interviews: ${interviews.length}`,
        }],
      });

      let data;
      try {
        const raw = response.content[0].text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        data = JSON.parse(raw);
      } catch {
        data = { summary: response.content[0].text };
      }

      return res.json({ success: true, data });
    }

    // Fallback
    res.json({
      success: true,
      data: {
        summary: 'Interview analysis report. Configure ANTHROPIC_API_KEY for AI-powered insights.',
        questionEffectiveness: [
          { category: 'Behavioral Questions', rating: 'high', insight: 'STAR-based questions consistently yield structured responses' },
          { category: 'Technical Assessment', rating: 'medium', insight: 'Consider adding more role-specific technical scenarios' },
          { category: 'Culture Fit', rating: 'medium', insight: 'Culture questions may benefit from alignment with Measurement13 framework' },
        ],
        scoringPatterns: 'Insufficient data to identify scoring patterns. Complete more interviews to generate meaningful analysis.',
        calibrationNotes: 'Recommend conducting interviewer calibration sessions after every 10 interviews to maintain consistency.',
      },
    });
  } catch (error) {
    console.error('Analysis report error:', error.message);
    res.status(500).json({
      success: false,
      error: { code: 'REPORT_ERROR', message: 'Failed to generate interview analysis report' },
    });
  }
});

// GET /api/v1/reports/decision/:candidateId — Generate hiring decision package
router.get('/decision/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;

    let candidate = null;
    let scores = [];
    let interviews = [];

    try {
      const orgId = req.orgId || 'default';
      candidate = await candidateRepository.findById(orgId, candidateId);
      const scoreResult = await scoreRepository.findAll(orgId, { candidateId });
      scores = scoreResult?.data || [];
      const intResult = await interviewRepository.findAll(orgId, { candidateId });
      interviews = intResult?.data || [];
    } catch {
      // fallback
    }

    if (aiService.client) {
      const response = await aiService.client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `Generate a board-ready hiring decision package as JSON. Return ONLY valid JSON:
{
  "candidateName": "string",
  "executiveSummary": "Comprehensive 2-3 paragraph executive summary suitable for board review",
  "decision": "proceed|hold|decline",
  "confidence": 0.0-1.0,
  "vectorAlignment": { "V1 Market": "Strong/Moderate/Weak", "V2 People": "...", ... },
  "riskFactors": ["risk1", ...],
  "nextSteps": ["step1", ...]
}

Candidate: ${JSON.stringify(candidate || { id: candidateId })}
Scores: ${JSON.stringify(scores)}
Interviews: ${JSON.stringify(interviews)}`,
        }],
      });

      let data;
      try {
        const raw = response.content[0].text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        data = JSON.parse(raw);
      } catch {
        data = { executiveSummary: response.content[0].text, candidateName: candidate?.name || candidateId };
      }

      return res.json({ success: true, data });
    }

    // Fallback
    res.json({
      success: true,
      data: {
        candidateName: candidate?.name || candidateId,
        executiveSummary: 'Hiring decision package requires AI service. Configure ANTHROPIC_API_KEY for comprehensive analysis.',
        decision: 'hold',
        confidence: 0,
        vectorAlignment: {},
        riskFactors: ['AI analysis unavailable - manual review required'],
        nextSteps: ['Configure AI service', 'Complete manual candidate evaluation', 'Gather additional interview data'],
      },
    });
  } catch (error) {
    console.error('Decision report error:', error.message);
    res.status(500).json({
      success: false,
      error: { code: 'REPORT_ERROR', message: 'Failed to generate hiring decision package' },
    });
  }
});

module.exports = router;
