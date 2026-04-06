#!/usr/bin/env node
/**
 * Seed Communications Templates — Interview9.ai
 * Upserts sender + email templates into the tgm-communications Cosmos DB
 * per TGM Unified Architecture Section 10.3.
 *
 * Usage:
 *   COMMS_COSMOS_ENDPOINT=https://... COMMS_COSMOS_KEY=... node scripts/seed-comms-templates.js
 */

const { CosmosClient } = require('@azure/cosmos');

const SENDER = {
  id: 'sender-interview9',
  name: 'Interview9.ai',
  email: 'support@thegreymatter.ai',
  type: 'sender',
  isActive: true,
};

const TEMPLATES = [
  {
    id: 'interview9-candidate-invite',
    appId: 'interview9',
    name: 'Candidate Interview Invitation',
    subject: '{{title}} — Interview Invitation',
    htmlBody: '<div>Hi {{recipientName}},<br/><br/>You have been invited to an interview for the <strong>{{positionTitle}}</strong> position at <strong>{{organizationName}}</strong>.<br/><br/><a href="{{interviewLink}}">View Details & Confirm</a><br/><br/>Please respond by {{responseDeadline}}.</div>',
    textBody: 'Hi {{recipientName}}, You have been invited to an interview for the {{positionTitle}} position at {{organizationName}}. Visit {{interviewLink}} to view details and confirm. Please respond by {{responseDeadline}}.',
    type: 'template',
    isActive: true,
    version: 1,
    defaultSenderId: 'sender-interview9',
    requiredFields: ['recipientName', 'title', 'positionTitle', 'organizationName', 'interviewLink'],
  },
  {
    id: 'interview9-interview-scheduled',
    appId: 'interview9',
    name: 'Interview Scheduled',
    subject: '{{title}} — Interview Confirmed',
    htmlBody: '<div>Hi {{recipientName}},<br/><br/>Your interview for <strong>{{positionTitle}}</strong> has been scheduled.<br/><br/><strong>Date:</strong> {{interviewDate}}<br/><strong>Time:</strong> {{interviewTime}}<br/><strong>Format:</strong> {{interviewFormat}}<br/><br/><a href="{{interviewLink}}">View Details</a></div>',
    textBody: 'Hi {{recipientName}}, Your interview for {{positionTitle}} has been scheduled. Date: {{interviewDate}}, Time: {{interviewTime}}, Format: {{interviewFormat}}. Visit {{interviewLink}} for details.',
    type: 'template',
    isActive: true,
    version: 1,
    defaultSenderId: 'sender-interview9',
    requiredFields: ['recipientName', 'title', 'positionTitle', 'interviewDate', 'interviewTime', 'interviewFormat', 'interviewLink'],
  },
  {
    id: 'interview9-assessment-complete',
    appId: 'interview9',
    name: 'Interview Assessment Complete',
    subject: '{{title}} — Assessment Results Available',
    htmlBody: '<div>Hi {{recipientName}},<br/><br/>The interview assessment for <strong>{{candidateName}}</strong> ({{positionTitle}}) is now complete.<br/><br/><a href="{{resultsLink}}">View Assessment Results</a></div>',
    textBody: 'Hi {{recipientName}}, The interview assessment for {{candidateName}} ({{positionTitle}}) is now complete. View results at {{resultsLink}}.',
    type: 'template',
    isActive: true,
    version: 1,
    defaultSenderId: 'sender-interview9',
    requiredFields: ['recipientName', 'title', 'candidateName', 'positionTitle', 'resultsLink'],
  },
];

async function seed() {
  const endpoint = process.env.COMMS_COSMOS_ENDPOINT;
  const key = process.env.COMMS_COSMOS_KEY;

  if (!endpoint || !key) {
    console.error('ERROR: COMMS_COSMOS_ENDPOINT and COMMS_COSMOS_KEY must be set.');
    process.exit(1);
  }

  const client = new CosmosClient({ endpoint, key });
  const container = client.database('tgm-communications').container('templates');
  const now = new Date().toISOString();

  // Upsert sender
  await container.items.upsert({ ...SENDER, createdAt: now, updatedAt: now });
  console.log(`[interview9] Upserted sender: ${SENDER.id}`);

  // Upsert templates
  for (const tpl of TEMPLATES) {
    await container.items.upsert({ ...tpl, createdAt: now, updatedAt: now });
    console.log(`[interview9] Upserted template: ${tpl.id}`);
  }

  console.log('[interview9] Seed complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
