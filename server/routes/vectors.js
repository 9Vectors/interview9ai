/**
 * Interview9ai — 9Vectors Scoring Endpoint
 *
 * Per TGM Unified Architecture Section 4.4:
 *   GET /api/vectors/:entityId
 *   GET /api/vectors/current
 *
 * Computes real(ish) scores from interview data using the
 * question->vector mappings defined in the client questions.js.
 *
 * Interview9ai maps to People-heavy vectors:
 *   - People (leadership assessment, talent evaluation)
 *   - Strategy (hiring strategy alignment)
 *   - Execution (interview process effectiveness)
 *   - Expectations (role requirements, competency frameworks)
 */

const express = require('express');
const router = express.Router();

/* ------------------------------------------------------------------ */
/*  9Vectors Mapping                                                   */
/* ------------------------------------------------------------------ */

const CATEGORY_TO_VECTORS = {
  CANDIDATE_ASSESSMENT: ['People', 'Expectations'],
  INTERVIEW_PROCESS: ['Execution', 'Operations'],
  HIRING_STRATEGY: ['Strategy', 'People'],
  COMPETENCY_FRAMEWORK: ['People', 'Expectations'],
  CULTURAL_FIT: ['People', 'Governance'],
  ROLE_REQUIREMENTS: ['Expectations', 'Strategy'],
  FEEDBACK_QUALITY: ['Execution', 'People'],
};

const ACTIVE_VECTORS = ['People', 'Strategy', 'Execution', 'Expectations'];

const VECTOR_DOMAINS = {
  Market: 'assets',
  People: 'assets',
  Finance: 'assets',
  Strategy: 'processes',
  Operations: 'processes',
  Execution: 'processes',
  Expectations: 'structures',
  Governance: 'structures',
  Entity: 'structures',
};

/* ------------------------------------------------------------------ */
/*  Question -> Vector mapping (mirrors client/src/data/questions.js)  */
/* ------------------------------------------------------------------ */

/**
 * Maps each vector name to an array of question IDs that feed into it.
 * Derived from the vectorMapping array in each question definition.
 */
const QUESTION_VECTOR_MAP = {
  V1: ['Q011', 'Q023', 'Q034'],  // Market
  V2: ['Q001', 'Q002', 'Q003', 'Q004', 'Q005', 'Q006', 'Q007', 'Q010', 'Q011', 'Q012', 'Q013', 'Q014', 'Q015', 'Q016', 'Q017', 'Q018', 'Q019', 'Q020', 'Q021', 'Q024', 'Q025', 'Q026', 'Q030', 'Q031', 'Q032', 'Q033', 'Q034', 'Q036'],  // People
  V3: ['Q009'],  // Finance
  V4: ['Q027', 'Q028'],  // Strategy
  V5: ['Q008'],  // Operations
  V6: ['Q006', 'Q009', 'Q017', 'Q022', 'Q035'],  // Execution
  V7: ['Q004', 'Q005', 'Q016', 'Q029'],  // Expectations
  V8: ['Q032'],  // Governance
  V9: [],  // Entity
};

/**
 * The canonical vector name by ID, matching the client VECTORS array.
 */
const VECTOR_NAME_MAP = {
  V1: 'Market',
  V2: 'People',
  V3: 'Finance',
  V4: 'Strategy',
  V5: 'Operations',
  V6: 'Execution',
  V7: 'Expectations',
  V8: 'Governance',
  V9: 'Entity',
};

/* ------------------------------------------------------------------ */
/*  Scoring Logic                                                      */
/* ------------------------------------------------------------------ */

/**
 * Compute vector scores from interview/scoring data.
 *
 * Scoring formula per Section 4.4:
 *   score = (evidenceCoverage * 0.6) + (dataCompleteness * 0.4)
 *
 * Where:
 *   - evidenceCoverage = (answeredQuestionsForVector / totalQuestionsForVector)
 *   - dataCompleteness = average score of answered questions (normalized to 0-100)
 *
 * @param {Object} answeredQuestions - Map of questionId -> { score: 1-5, answered: boolean }
 */
function computeVectorScores(answeredQuestions = {}) {
  const vectors = ACTIVE_VECTORS.map((vectorName) => {
    // Find the vector ID for this name
    const vectorId = Object.entries(VECTOR_NAME_MAP)
      .find(([, name]) => name === vectorName)?.[0];

    if (!vectorId) {
      return {
        vector: vectorName,
        domain: VECTOR_DOMAINS[vectorName] || 'processes',
        score: 0,
        evidenceCount: 0,
        completedItems: 0,
        totalItems: 0,
        coverage: 0,
        subVectors: [],
      };
    }

    const mappedQuestionIds = QUESTION_VECTOR_MAP[vectorId] || [];
    const totalQuestions = mappedQuestionIds.length;

    // Accumulate evidence from answered questions
    const answered = mappedQuestionIds.filter(qId => answeredQuestions[qId]?.answered);
    const answeredCount = answered.length;

    // Evidence coverage (0-1)
    const evidenceCoverage = totalQuestions > 0
      ? answeredCount / totalQuestions
      : 0;

    // Data completeness: average normalized score of answered questions
    // Scores are 1-5, normalize to 0-100
    const scores = answered
      .map(qId => answeredQuestions[qId]?.score)
      .filter(s => s !== undefined && s !== null);

    const avgNormalized = scores.length > 0
      ? (scores.reduce((sum, s) => sum + s, 0) / scores.length) * 20  // 1-5 -> 20-100
      : 0;

    // Final score = (evidenceCoverage * 0.6) + (dataCompleteness * 0.4)
    const score = Math.round((evidenceCoverage * 100 * 0.6) + (avgNormalized * 0.4));

    // Derive categories that map to this vector for sub-vector breakdown
    const mappedCategories = Object.entries(CATEGORY_TO_VECTORS)
      .filter(([, vectors]) => vectors.includes(vectorName))
      .map(([cat]) => cat);

    const subVectors = mappedCategories.map((cat) => {
      const catName = cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      // Sub-vector score: slightly vary from parent
      const subScore = Math.min(100, Math.max(0,
        score + Math.round((Math.random() * 10) - 5)
      ));
      return {
        name: catName,
        score: answeredCount > 0 ? subScore : 0,
        evidenceCount: Math.min(answeredCount, 3),
      };
    });

    return {
      vector: vectorName,
      domain: VECTOR_DOMAINS[vectorName] || 'processes',
      score,
      evidenceCount: answeredCount,
      completedItems: answeredCount,
      totalItems: totalQuestions,
      coverage: evidenceCoverage,
      subVectors,
    };
  });

  const activeVectors = vectors.filter(v => v.totalItems > 0);
  const overallScore = activeVectors.length > 0
    ? Math.round(activeVectors.reduce((sum, v) => sum + v.score, 0) / activeVectors.length)
    : 0;
  const totalEvidence = vectors.reduce((sum, v) => sum + v.evidenceCount, 0);

  return { vectors, overallScore, totalEvidence };
}

/* ------------------------------------------------------------------ */
/*  Routes                                                             */
/* ------------------------------------------------------------------ */

/**
 * GET /api/vectors/current
 * Compute scores from all available interview data (no specific entity).
 * Returns Section 4.4 format.
 */
router.get('/current', (req, res) => {
  try {
    // In a real implementation, this would pull from the interview DB.
    // For now, generate reasonable baseline scores that reflect having
    // some interviews in progress (matching the store seed data).
    const simulatedAnswers = {};

    // Simulate that ~60% of questions have been answered with varying scores
    const allQuestionIds = [
      'Q001','Q002','Q003','Q004','Q005','Q006','Q007','Q008','Q009','Q010',
      'Q011','Q012','Q013','Q014','Q015','Q016','Q017','Q018','Q019','Q020',
      'Q021','Q022','Q023','Q024','Q025','Q026','Q027','Q028','Q029','Q030',
      'Q031','Q032','Q033','Q034','Q035','Q036',
    ];

    allQuestionIds.forEach((qId, idx) => {
      // ~60% answered
      if (idx % 5 !== 0) {
        simulatedAnswers[qId] = {
          answered: true,
          score: 3 + Math.round(Math.random() * 2), // 3-5
        };
      }
    });

    const { vectors, overallScore, totalEvidence } = computeVectorScores(simulatedAnswers);

    res.json({
      data: {
        entityId: 'current',
        vectors,
        overallScore,
        totalEvidence,
        analyzedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Vectors] current scoring error:', error);
    res.status(500).json({
      error: 'Failed to compute vector scores',
      message: error.message,
    });
  }
});

/**
 * GET /api/vectors/:entityId
 * Standard TGM 9Vectors response format for a specific entity (candidate).
 */
router.get('/:entityId', (req, res) => {
  try {
    const { entityId } = req.params;

    // In production, pull real answered-question data for this entity.
    // For now, compute with simulated data keyed by entity.
    const simulatedAnswers = {};
    const allQuestionIds = [
      'Q001','Q002','Q003','Q004','Q005','Q006','Q007','Q008','Q009','Q010',
      'Q011','Q012','Q013','Q014','Q015','Q016','Q017','Q018','Q019','Q020',
      'Q021','Q022','Q023','Q024','Q025','Q026','Q027','Q028','Q029','Q030',
      'Q031','Q032','Q033','Q034','Q035','Q036',
    ];

    // Deterministic-ish seeding based on entityId
    const seed = entityId.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
    allQuestionIds.forEach((qId, idx) => {
      if ((idx + seed) % 3 !== 0) {
        simulatedAnswers[qId] = {
          answered: true,
          score: Math.min(5, Math.max(1, ((seed + idx) % 5) + 1)),
        };
      }
    });

    const { vectors, overallScore, totalEvidence } = computeVectorScores(simulatedAnswers);

    res.json({
      data: {
        entityId,
        vectors,
        overallScore,
        totalEvidence,
        analyzedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Vectors] scoring error:', error);
    res.status(500).json({
      error: 'Failed to compute vector scores',
      message: error.message,
    });
  }
});

module.exports = router;
