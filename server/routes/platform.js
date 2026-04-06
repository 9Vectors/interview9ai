const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Apply auth middleware to all platform routes
router.use(authMiddleware);

// POST /api/v1/platform/sync
router.post('/sync', async (req, res) => {
  try {
    const { dataType, payload } = req.body;

    // In production, syncs to TheGreyMatter.ai platform — scoped to user's org
    console.log(`[Platform Sync] Org: ${req.orgId}, Type: ${dataType}, Payload size: ${JSON.stringify(payload).length} bytes`);

    res.json({
      success: true,
      data: {
        synced: true,
        dataType,
        orgId: req.orgId,
        timestamp: new Date().toISOString(),
        targetPlatform: 'thegreymatter.ai',
      },
    });
  } catch (error) {
    console.error('Platform sync error:', error.message);
    res.status(500).json({ success: false, error: { code: 'SYNC_ERROR', message: 'Platform sync failed' } });
  }
});

// GET /api/v1/platform/data
router.get('/data', async (req, res) => {
  try {
    // In production, fetches cross-app data from TheGreyMatter.ai scoped to org
    res.json({
      success: true,
      data: {
        source: 'thegreymatter.ai',
        orgId: req.orgId,
        crossAppData: {
          orgVectorScores: { V1: 7.2, V2: 6.8, V3: 8.1, V4: 7.0, V5: 6.5, V6: 7.4, V7: 6.9, V8: 7.8, V9: 7.1 },
          benchmarks: { industry: 'Technology', avgHiringScore: 3.5, avgRetention: 0.82 },
        },
      },
    });
  } catch (error) {
    console.error('Platform data fetch error:', error.message);
    res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: 'Failed to fetch platform data' } });
  }
});

// POST /api/v1/platform/webhook
router.post('/webhook', async (req, res) => {
  try {
    const { event, data } = req.body;
    console.log(`[Webhook] Org: ${req.orgId}, Event: ${event}`);

    // Process platform events
    switch (event) {
      case 'assessment.completed':
        console.log('Assessment completed — updating candidate data');
        break;
      case 'user.action_required':
        console.log('Action required — generating notification');
        break;
      default:
        console.log(`Unhandled event: ${event}`);
    }

    res.json({ success: true, received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).json({ success: false, error: { code: 'WEBHOOK_ERROR', message: 'Webhook processing failed' } });
  }
});

module.exports = router;
