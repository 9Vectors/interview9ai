/**
 * Interview9.ai Cosmos DB Container Definitions
 * All containers partitioned by /orgId for multi-tenant isolation.
 */

const CONTAINER_DEFINITIONS = [
  { id: 'candidates',        partitionKey: '/orgId' },
  { id: 'hiringProcesses',   partitionKey: '/orgId' },
  { id: 'interviews',        partitionKey: '/orgId' },
  { id: 'scores',            partitionKey: '/orgId' },
  { id: 'references',        partitionKey: '/orgId' },
  { id: 'interviewPlans',    partitionKey: '/orgId' },
  { id: 'documents',         partitionKey: '/orgId' },
  { id: 'aiAnalyses',        partitionKey: '/orgId' },
];

/**
 * Ensure all required containers exist in the database.
 * @param {import('@azure/cosmos').Database} database
 */
async function ensureContainers(database) {
  for (const def of CONTAINER_DEFINITIONS) {
    await database.containers.createIfNotExists({
      id: def.id,
      partitionKey: { paths: [def.partitionKey] },
    });
    console.log(`[Interview9] Container ready: ${def.id}`);
  }
}

module.exports = { ensureContainers, CONTAINER_DEFINITIONS };
