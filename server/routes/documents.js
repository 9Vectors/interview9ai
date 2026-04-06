/**
 * Document Upload Routes — Interview9.ai
 * Accepts multipart file uploads and stores them via the TGM File Service,
 * tagging with origin-app, entity, org, and 9-vector metadata.
 */

const express = require('express');
const multer = require('multer');
const router = express.Router();

const {
  createUserClient,
  uploadFile,
  tagFile,
  buildTags,
  VECTOR_MAP,
} = require('../integrations/fileService');

// In-memory multer — files are forwarded straight to File Service
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

/**
 * POST /api/v1/documents/upload
 *
 * Body (multipart/form-data):
 *   file       — the document
 *   entityType — e.g. 'candidate', 'interview'
 *   entityId   — the entity's unique id
 *   docType    — key into VECTOR_MAP (optional, drives 9v tagging)
 */
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { entityType, entityId, docType } = req.body;
    if (!entityType || !entityId) {
      return res.status(400).json({ error: 'entityType and entityId are required' });
    }

    const orgId = req.user?.organizationId || req.headers['x-org-id'];
    if (!orgId) {
      return res.status(400).json({ error: 'Organization context required' });
    }

    // 1. Upload to TGM File Service
    const bearerToken = req.headers.authorization?.replace('Bearer ', '');
    const client = createUserClient(bearerToken);
    const { data: uploaded } = await uploadFile(client, req.file, entityId);

    // 2. Tag with standard metadata + vector tag
    const tags = buildTags(orgId, entityType, entityId, docType);
    await tagFile(client, uploaded.id || uploaded.fileId, tags);

    res.status(201).json({
      success: true,
      file: {
        id: uploaded.id || uploaded.fileId,
        filename: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        tags,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/documents/vector-map
 * Returns the document-type -> vector mapping for client-side reference.
 */
router.get('/vector-map', (_req, res) => {
  res.json(VECTOR_MAP);
});

module.exports = router;
