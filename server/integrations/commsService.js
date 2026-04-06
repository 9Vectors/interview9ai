/**
 * TGM Communications Service Integration — Interview9.ai
 * Per TGM Unified Architecture Section 10
 *
 * Fire-and-forget email delivery via the centralised TGM Communications
 * Service.  Failures are logged but never block the calling operation.
 */

const axios = require('axios');
const crypto = require('crypto');

const APP_ID = 'interview9';

const commsClient = axios.create({
  baseURL: process.env.COMMS_SERVICE_URL || process.env.COMMUNICATIONS_SERVICE_URL,
  headers: {
    'x-comms-service-key': process.env.COMMS_SERVICE_KEY,
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * Send an email through the TGM Communications Service.
 *
 * @param {string}          templateId  - registered template id
 * @param {string|string[]} recipients  - one or more email addresses
 * @param {object}          data        - template merge fields
 * @param {string}          [senderId]  - override sender (default: sender-interview9)
 * @returns {object|null} result from comms service, or null on failure
 */
async function sendEmail(templateId, recipients, data, senderId) {
  try {
    const { data: result } = await commsClient.post('/api/v1/send', {
      templateId,
      recipients: Array.isArray(recipients) ? recipients : [recipients],
      data,
      idempotencyKey: crypto.randomUUID(),
      senderId: senderId || `sender-${APP_ID}`,
    });
    return result;
  } catch (err) {
    console.error('Comms send failed (non-blocking):', err.message);
    return null; // Fire-and-forget per spec
  }
}

module.exports = { sendEmail, commsClient, APP_ID };
