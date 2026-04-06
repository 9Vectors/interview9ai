/**
 * TGM File Service Client — Interview9ai
 *
 * Shared client for interacting with TGM's centralised File Service.
 * Two auth modes:
 *   1. User-context  — forwards the caller's JWT (Authorization header)
 *   2. Service-context — uses x-file-service-internal-key + x-org-id
 *
 * Tag conventions (additive only — never full-replace):
 *   originapp:interview9ai
 *   entity:<type>:<id>
 *   orgid:<org-id>
 *   9v:<vector>
 *
 * Env vars:
 *   FILE_SERVICE_URL           — base URL of the TGM File Service
 *   FILE_SERVICE_INTERNAL_KEY  — shared secret for service-to-service calls
 */

import axios from 'axios';

const APP_ID = 'interview9ai';

const FILE_SERVICE_URL = process.env.FILE_SERVICE_URL;
const FILE_SERVICE_INTERNAL_KEY = process.env.FILE_SERVICE_INTERNAL_KEY;

// ---------------------------------------------------------------------------
// Client factories
// ---------------------------------------------------------------------------

/**
 * Create a user-context client that forwards the caller's Bearer token.
 * Use for user-initiated uploads / downloads where the JWT carries identity.
 */
export function createUserClient(bearerToken) {
  if (!FILE_SERVICE_URL) {
    console.warn(`[${APP_ID}:file-client] FILE_SERVICE_URL not set — file operations will fail at runtime`);
  }
  return axios.create({
    baseURL: FILE_SERVICE_URL || 'http://localhost:9999',
    headers: { Authorization: `Bearer ${bearerToken}` },
    timeout: 30_000,
  });
}

/**
 * Create a service-context client authenticated with the internal key.
 * Use for server-to-server calls (background jobs, webhooks, extraction).
 */
export function createServiceClient(orgId) {
  if (!FILE_SERVICE_URL) {
    console.warn(`[${APP_ID}:file-client] FILE_SERVICE_URL not set — file operations will fail at runtime`);
  }
  return axios.create({
    baseURL: FILE_SERVICE_URL || 'http://localhost:9999',
    headers: {
      ...(FILE_SERVICE_INTERNAL_KEY
        ? { 'x-file-service-internal-key': FILE_SERVICE_INTERNAL_KEY }
        : {}),
      'x-org-id': orgId,
    },
    timeout: 30_000,
  });
}

// ---------------------------------------------------------------------------
// File operations
// ---------------------------------------------------------------------------

/**
 * Upload a file buffer to TGM File Service.
 * Automatically adds originapp and orgid tags.
 *
 * @param {Buffer} file - File content buffer
 * @param {string} filename - Original filename
 * @param {string} contentType - MIME type
 * @param {{ orgId: string, tags?: string[], entityType?: string, entityId?: string, docType?: string }} opts
 * @param {import('axios').AxiosInstance} [client] - Optional pre-configured client
 * @returns {Promise<{ fileId: string, url: string }>}
 */
export async function uploadFile(file, filename, contentType, opts, client) {
  const httpClient = client || createServiceClient(opts.orgId);

  const tags = [
    `originapp:${APP_ID}`,
    `orgid:${opts.orgId}`,
    ...(opts.entityType && opts.entityId ? [`entity:${opts.entityType}:${opts.entityId}`] : []),
    ...(opts.tags || []),
  ];

  const formData = new FormData();
  const blob = new Blob([file], { type: contentType });
  formData.append('file', blob, filename);
  formData.append('originApp', APP_ID);
  formData.append('orgId', opts.orgId);
  if (opts.docType) formData.append('docType', opts.docType);

  const response = await httpClient.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  const result = response.data;

  // Apply tags additively after upload
  if (tags.length > 0 && result.fileId) {
    await addTags(result.fileId, tags, httpClient).catch((err) =>
      console.warn(`[${APP_ID}:file-client] Failed to add tags after upload:`, err.message),
    );
  }

  return result;
}

/**
 * Get a download URL (or stream) for a file.
 *
 * @param {string} fileId
 * @param {import('axios').AxiosInstance} client - Required pre-configured client (user or service context)
 * @returns {Promise<{ url: string }>}
 */
export async function downloadFile(fileId, client) {
  if (!client) {
    throw new Error(`[${APP_ID}:file-client] downloadFile requires a pre-configured client — orgId context must be explicit`);
  }
  const response = await client.get(`/files/${fileId}/download`);
  return response.data;
}

/**
 * Add tags to a file (additive — never replaces existing tags).
 *
 * @param {string} fileId
 * @param {string[]} tags
 * @param {import('axios').AxiosInstance} client - Required pre-configured client (user or service context)
 * @returns {Promise<Object>} Updated file metadata
 */
export async function addTags(fileId, tags, client) {
  if (!client) {
    throw new Error(`[${APP_ID}:file-client] addTags requires a pre-configured client — orgId context must be explicit`);
  }
  const response = await client.patch(`/files/${fileId}`, { addTags: tags });
  return response.data;
}

/**
 * List files matching the given criteria.
 *
 * @param {string} orgId
 * @param {{ entityId?: string, docType?: string, tags?: string[] }} [filters]
 * @param {import('axios').AxiosInstance} [client]
 * @returns {Promise<Array>}
 */
export async function listFiles(orgId, filters, client) {
  const httpClient = client || createServiceClient(orgId);
  const params = { orgId, appId: APP_ID, ...filters };
  const response = await httpClient.get('/files', { params });
  return response.data;
}
