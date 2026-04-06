#!/bin/bash
# Interview9.ai — Create Cosmos DB database and containers
# Uses TGM shared Cosmos account pattern
#
# Usage: bash infra/setup-cosmos.sh
# Prerequisites: az login, correct subscription selected

set -euo pipefail

ACCOUNT_NAME="${COSMOS_ACCOUNT:-tgm-cosmos-dev}"
RESOURCE_GROUP="${COSMOS_RG:-TGM3}"
DATABASE_NAME="${COSMOS_DATABASE:-interview9}"

echo "[Interview9] Creating database: ${DATABASE_NAME} in account: ${ACCOUNT_NAME}"

az cosmosdb sql database create \
  --account-name "$ACCOUNT_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --name "$DATABASE_NAME"

CONTAINERS=(
  candidates
  hiringProcesses
  interviews
  scores
  references
  interviewPlans
  documents
  aiAnalyses
)

for container in "${CONTAINERS[@]}"; do
  echo "[Interview9] Creating container: ${container}"
  az cosmosdb sql container create \
    --account-name "$ACCOUNT_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --database-name "$DATABASE_NAME" \
    --name "$container" \
    --partition-key-path /orgId
done

echo "[Interview9] Cosmos DB setup complete — ${#CONTAINERS[@]} containers created."
