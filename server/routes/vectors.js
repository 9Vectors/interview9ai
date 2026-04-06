/**
 * Interview9ai — 9Vectors Scoring Endpoint
 *
 * Per TGM Unified Architecture Section 4.4:
 *   GET /api/vectors/:entityId
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
/*  Scoring helpers                                                    */
/* ------------------------------------------------------------------ */

/**
 * Placeholder scoring — returns computed scores from available data.
 * Once real interview data flows through, replace with grounded scoring.
 */
function computeVectorScores(entityId) {
  const vectors = ACTIVE_VECTORS.map((vector) => {
    // Derive categories that map to this vector
    const mappedCategories = Object.entries(CATEGORY_TO_VECTORS)
      .filter(([, vectors]) => vectors.includes(vector))
      .map(([cat]) => cat);

    const evidenceCount = mappedCategories.length * 2; // placeholder multiplier
    const score = Math.min(100, Math.round(evidenceCount * 8 + 20)); // baseline + evidence scaling
    const totalItems = mappedCategories.length * 3;
    const completedItems = Math.round(totalItems * (score / 100));

    return {
      vector,
      domain: VECTOR_DOMAINS[vector] || 'processes',
      score,
      evidenceCount,
      completedItems,
      totalItems,
      coverage: score / 100,
      subVectors: mappedCategories.map((cat) => ({
        name: cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        score: Math.min(100, Math.round(score + (Math.random() * 10 - 5))),
        evidenceCount: 2,
      })),
    };
  });

  const overallScore = Math.round(
    vectors.reduce((sum, v) => sum + v.score, 0) / vectors.length,
  );
  const totalEvidence = vectors.reduce((sum, v) => sum + v.evidenceCount, 0);

  return { vectors, overallScore, totalEvidence };
}

/* ------------------------------------------------------------------ */
/*  Routes                                                             */
/* ------------------------------------------------------------------ */

/**
 * GET /api/vectors/:entityId
 * Standard TGM 9Vectors response format
 */
router.get('/:entityId', (req, res) => {
  try {
    const { entityId } = req.params;
    const { vectors, overallScore, totalEvidence } = computeVectorScores(entityId);

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
