const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/auth');
const aiService = require('../services/aiService');
const candidateRepository = require('../repositories/candidateRepository');
const scoreRepository = require('../repositories/scoreRepository');
const interviewRepository = require('../repositories/interviewRepository');
const router = express.Router();

// Configure multer for resume uploads (in-memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are accepted'));
    }
  },
});

// Apply auth middleware to all AI routes (except resume parsing which may be used pre-auth)
router.use((req, res, next) => {
  // Allow parse-resume without auth for simpler UX; protect other routes
  if (req.path === '/parse-resume') return next();
  return authMiddleware(req, res, next);
});

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

// POST /api/v1/ai/parse-resume
router.post('/parse-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'No resume file uploaded' },
      });
    }

    // Extract text from the uploaded file
    let textContent = '';
    const mime = req.file.mimetype;

    if (mime === 'application/pdf') {
      try {
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(req.file.buffer);
        textContent = pdfData.text;
      } catch (err) {
        console.error('PDF parse error:', err.message);
        return res.status(422).json({
          success: false,
          error: { code: 'PARSE_ERROR', message: 'Could not extract text from PDF. Ensure pdf-parse is installed.' },
        });
      }
    } else if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer: req.file.buffer });
        textContent = result.value;
      } catch (err) {
        console.error('DOCX parse error:', err.message);
        return res.status(422).json({
          success: false,
          error: { code: 'PARSE_ERROR', message: 'Could not extract text from DOCX. Ensure mammoth is installed.' },
        });
      }
    }

    if (!textContent || textContent.trim().length < 20) {
      return res.status(422).json({
        success: false,
        error: { code: 'PARSE_ERROR', message: 'Could not extract meaningful text from the uploaded file' },
      });
    }

    // Use AI to parse the resume text
    if (!aiService.client) {
      // Fallback: return basic extraction without AI
      return res.json({
        success: true,
        data: {
          name: '',
          email: '',
          phone: '',
          currentRole: '',
          company: '',
          yearsExperience: '',
          skills: [],
          education: '',
          summary: textContent.substring(0, 500),
          _note: 'AI unavailable - raw text returned. Configure ANTHROPIC_API_KEY for intelligent parsing.',
        },
      });
    }

    const response = await aiService.client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `Parse the following resume text and extract structured data. Return ONLY valid JSON with these exact fields:
{
  "name": "Full name",
  "email": "email@example.com",
  "phone": "phone number",
  "currentRole": "most recent job title",
  "company": "most recent company",
  "yearsExperience": number or null,
  "skills": ["skill1", "skill2", ...],
  "education": "highest degree and school",
  "summary": "2-3 sentence professional summary"
}

If a field cannot be determined, use empty string or empty array. For yearsExperience, estimate from work history if not stated explicitly.

Resume text:
${textContent.substring(0, 8000)}`,
        },
      ],
    });

    let parsed;
    try {
      const raw = response.content[0].text;
      // Handle potential markdown code blocks
      const jsonStr = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      parsed = {
        name: '',
        email: '',
        phone: '',
        currentRole: '',
        company: '',
        yearsExperience: '',
        skills: [],
        education: '',
        summary: 'AI parsing returned unexpected format. Please fill in details manually.',
      };
    }

    res.json({ success: true, data: parsed });
  } catch (error) {
    console.error('Resume parse error:', error.message);
    res.status(500).json({
      success: false,
      error: { code: 'PARSE_ERROR', message: 'Failed to parse resume' },
    });
  }
});

module.exports = router;
