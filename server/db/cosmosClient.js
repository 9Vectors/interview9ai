const { CosmosClient } = require('@azure/cosmos');
const { ensureContainers } = require('./containers');

let client = null;
let database = null;
let cosmosAvailable = false;

/**
 * Initialize Cosmos DB connection for Interview9.ai
 * Follows TGM shared-account pattern: shared Cosmos account, per-app database.
 * Falls back gracefully to in-memory if not configured.
 */
async function initCosmos() {
  const connectionString = process.env.COSMOS_CONNECTION_STRING;
  const endpoint = process.env.COSMOS_ENDPOINT;
  const key = process.env.COSMOS_KEY;

  if (!connectionString && !endpoint) {
    console.warn('[Interview9] COSMOS not configured — using in-memory fallback');
    return null;
  }

  try {
    if (connectionString) {
      client = new CosmosClient(connectionString);
    } else {
      client = new CosmosClient({ endpoint, key });
    }

    const databaseId = process.env.COSMOS_DATABASE || 'interview9';
    const { database: db } = await client.databases.createIfNotExists({ id: databaseId });
    database = db;

    await ensureContainers(database);
    cosmosAvailable = true;

    console.log(`[Interview9] Cosmos DB connected — database: ${databaseId}`);
    return database;
  } catch (err) {
    console.error('[Interview9] Cosmos DB init failed — falling back to in-memory:', err.message);
    cosmosAvailable = false;
    return null;
  }
}

function getDatabase() {
  return database;
}

function isCosmosAvailable() {
  return cosmosAvailable;
}

module.exports = { initCosmos, getDatabase, isCosmosAvailable };
