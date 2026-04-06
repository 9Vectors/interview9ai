/**
 * TGM File Service Integration — Interview9.ai
 * Per TGM Unified Architecture Section 9
 *
 * Provides upload, tagging, and download capabilities against the
 * centralised TGM File Service.  Two client modes:
 *   - User client  — forwards the caller's bearer token (UI-initiated ops)
 *   - Service client — uses an internal key + org header (background jobs)
 */

const axios = require('axios');

const ORIGIN_APP = 'interview9';

/**
 * Vector mapping for Interview9 document types.
 * Maps document categories to their corresponding 9-vector tags.
 */
const VECTOR_MAP = {
  'candidate-resume':       '9v:talent',
  'interview-transcript':   '9v:talent',
  'assessment-report':      '9v:talent',
  'scorecard':              '9v:talent',
  'job-description':        '9v:organization',
  'interview-guide':        '9v:talent',
  'competency-framework':   '9v:leadership',
  'hiring-plan':            '9v:strategy',
};

/* ------------------------------------------------------------------ */
/*  Client factories                                                   */
/* ------------------------------------------------------------------ */

function createUserClient(bearerToken) {
  return axios.create({
    baseURL: process.env.FILE_SERVICE_URL,
    headers: { Authorization: `Bearer ${bearerToken}` },
    timeout: 30000,
  });
}

function createServiceClient(orgId) {
  return axios.create({
    baseURL: process.env.FILE_SERVICE_URL,
    headers: {
      'x-file-service-internal-key': process.env.FILE_SERVICE_INTERNAL_KEY,
      'x-org-id': orgId,
    },
    timeout: 30000,
  });
}

/* ------------------------------------------------------------------ */
/*  Operations                                                         */
/* ------------------------------------------------------------------ */

async function uploadFile(client, file, externalId) {
  const form = new FormData();
  form.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname);
  form.append('originApp', ORIGIN_APP);
  if (externalId) form.append('externalId', externalId);
  return client.post('/files/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

async function tagFile(client, fileId, tags) {
  return client.patch(`/files/${fileId}`, { addTags: tags });
}

async function downloadFile(client, fileId) {
  return client.get(`/files/${fileId}/download`, { responseType: 'arraybuffer' });
}

/**
 * Build the standard tag set for an Interview9 document.
 *
 * @param {string} orgId        - organisation identifier
 * @param {string} entityType   - e.g. 'candidate', 'interview'
 * @param {string} entityId     - the entity's unique id
 * @param {string} [docType]    - key into VECTOR_MAP
 * @returns {string[]}
 */
function buildTags(orgId, entityType, entityId, docType) {
  const tags = [
    `originapp:${ORIGIN_APP}`,
    `entity:${entityType}:${entityId}`,
    `orgid:${orgId}`,
  ];
  const vectorTag = VECTOR_MAP[docType];
  if (vectorTag) tags.push(vectorTag);
  return tags;
}

module.exports = {
  ORIGIN_APP,
  VECTOR_MAP,
  createUserClient,
  createServiceClient,
  uploadFile,
  tagFile,
  downloadFile,
  buildTags,
};
