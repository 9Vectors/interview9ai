/**
 * TGM Comms Service client — Interview9ai
 *
 * Sends templated emails via the shared Communications Service.
 * Fire-and-forget: catches errors, logs, never throws.
 *
 * Env vars:
 *   COMMS_SERVICE_URL   — base URL of comms-service
 *   COMMS_SERVICE_KEY   — x-comms-service-key header value
 */

import { randomUUID } from 'node:crypto';

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const COMMS_SERVICE_URL = process.env.COMMS_SERVICE_URL || '';
const COMMS_SERVICE_KEY = process.env.COMMS_SERVICE_KEY || '';
const TIMEOUT_MS = 30_000;

function isConfigured() {
  return !!COMMS_SERVICE_URL && !!COMMS_SERVICE_KEY;
}

/* ------------------------------------------------------------------ */
/*  sendEmail                                                          */
/* ------------------------------------------------------------------ */

/**
 * @param {string}   templateId
 * @param {string[]} recipients
 * @param {Record<string,string>} data
 * @param {string}   [senderId]
 * @returns {Promise<{messageId:string, status:string}|null>}
 */
export async function sendEmail(templateId, recipients, data, senderId) {
  if (!isConfigured()) {
    console.warn('[comms] Comms Service not configured — skipping email', templateId);
    return null;
  }

  const idempotencyKey = randomUUID();
  const url = `${COMMS_SERVICE_URL.replace(/\/+$/, '')}/api/v1/send`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-comms-service-key': COMMS_SERVICE_KEY,
        'X-Correlation-Id': randomUUID(),
      },
      body: JSON.stringify({
        templateId,
        recipients,
        data,
        idempotencyKey,
        ...(senderId ? { senderId } : {}),
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error(`[comms] send failed: ${res.status} ${body}`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('[comms] send error (non-fatal):', err.message || err);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  sendBatch                                                          */
/* ------------------------------------------------------------------ */

/**
 * @param {string}   templateId
 * @param {Array<{email:string, data:Record<string,string>}>} entries
 * @param {string}   [senderId]
 */
export async function sendBatch(templateId, entries, senderId) {
  return Promise.all(
    entries.map((entry) => sendEmail(templateId, [entry.email], entry.data, senderId)),
  );
}

/* ------------------------------------------------------------------ */
/*  Template IDs                                                       */
/* ------------------------------------------------------------------ */

export const COMMS_TEMPLATES = {
  INTERVIEW_SCHEDULED: 'interview9-interview_scheduled',
  INTERVIEW_REMINDER: 'interview9-interview_reminder',
  INTERVIEW_COMPLETE: 'interview9-interview_complete',
  CANDIDATE_FEEDBACK_READY: 'interview9-feedback_ready',
  SCORECARD_SHARED: 'interview9-scorecard_shared',
  WEEKLY_DIGEST: 'interview9-weekly_digest',
};

export const commsClient = {
  isConfigured,
  sendEmail,
  sendBatch,
  COMMS_TEMPLATES,
};

export default commsClient;
