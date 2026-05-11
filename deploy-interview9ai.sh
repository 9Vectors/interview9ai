#!/usr/bin/env bash
# =============================================================================
# Interview9.ai - Full Stack Deployment
# Builds and deploys API + Web containers to Azure Container Apps
# =============================================================================
# Usage:
#   ./deploy-interview9ai.sh [--env dev|prod] [--allow-dirty]
#
# This script:
#   1. Builds API Docker image (Express, Node 20) from server/Dockerfile
#   2. Builds client Docker image (Vite build + nginx) from client/Dockerfile.azure
#   3. Pushes both images to Azure Container Registry (acrtgmprod / acrtgmdev)
#   4. Creates or updates Azure Container Apps (eco-interview9ai-{api,web})
#   5. Binds custom domain + managed TLS certificate (if DNS zone exists)
#   6. Optionally registers in TGM App Store (if TGM_ADMIN_* are set)
#
# Prerequisites:
#   - Azure CLI (az) logged in
#   - Docker running
#   - Optional: .env or server/.env with secrets (ANTHROPIC_API_KEY, JWT_SECRET, ...)
#
# Examples:
#   ./deploy-interview9ai.sh                       # deploys to dev
#   ./deploy-interview9ai.sh --env prod            # deploys to prod (clean tree)
#   ./deploy-interview9ai.sh --env prod --allow-dirty
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Convert MSYS /c/... path to C:/... for Docker Desktop on Windows
if [[ "$SCRIPT_DIR" =~ ^/([a-zA-Z])/ ]]; then
  SCRIPT_DIR="${BASH_REMATCH[1]^}:${SCRIPT_DIR:2}"
fi

# ── Parse arguments ──────────────────────────────────────────────────────────
ENV="dev"
ALLOW_DIRTY=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env)  ENV="$2"; shift 2 ;;
    --allow-dirty) ALLOW_DIRTY=1; shift ;;
    --help|-h)
      sed -n '2,25p' "$0"
      exit 0 ;;
    *)
      echo "ERROR: Unknown argument: $1" >&2; exit 1 ;;
  esac
done

if [[ "$ENV" != "dev" && "$ENV" != "prod" ]]; then
  echo "ERROR: Environment must be 'dev' or 'prod', got: $ENV" >&2
  exit 1
fi

# ── Working tree guardrail ───────────────────────────────────────────────────
# Docker builds from the working tree, so any uncommitted changes get baked
# into the prod image. The previous live image was deployed by ad-hoc tooling
# and wasn't reproducible from a clean commit; refuse to roll prod unless
# --allow-dirty is explicitly passed.
if git -C "$SCRIPT_DIR" rev-parse --git-dir >/dev/null 2>&1; then
  DIRTY_COUNT=$(git -C "$SCRIPT_DIR" status --porcelain | wc -l | tr -d ' ')
  if [[ "$DIRTY_COUNT" -gt 0 ]]; then
    if [[ "$ENV" == "prod" && "$ALLOW_DIRTY" -ne 1 ]]; then
      echo "ERROR: working tree has $DIRTY_COUNT uncommitted change(s)." >&2
      echo "       Commit, stash, or pass --allow-dirty to deploy anyway." >&2
      echo "       The image will be built from the working tree as-is." >&2
      git -C "$SCRIPT_DIR" status --short >&2
      exit 1
    else
      echo "WARN: working tree has $DIRTY_COUNT uncommitted change(s)." >&2
      echo "      Image will bundle local changes that aren't in any commit." >&2
    fi
  fi
fi

# ── Environment-specific Azure settings ──────────────────────────────────────
DNS_ZONE="thegreymatter.ai"
DNS_RESOURCE_GROUP="thegreymatter.ai"

if [[ "$ENV" == "dev" ]]; then
  RESOURCE_GROUP="interview9-dev"
  CONTAINER_ENV="ecosystem-dev"
  CONTAINER_ENV_RG="ecosystem-shared-dev"
  REGISTRY="acrtgmdev"
  TGM_AUTH_URL="https://auth.test.thegreymatter.ai"
  TGM_API_URL="https://api.test.thegreymatter.ai"
  TGM_AUTH_SERVICE_URL="https://tgm-auth-dev.victoriouscoast-1f806a31.eastus.azurecontainerapps.io"
  TGM_FILE_SERVICE_URL="https://tgm-file-service-dev.victoriouscoast-1f806a31.eastus.azurecontainerapps.io"
  TGM_COMMS_SERVICE_URL="https://tgm-communications-service-dev.victoriouscoast-1f806a31.eastus.azurecontainerapps.io"
  CUSTOM_DOMAIN="interview9.test.thegreymatter.ai"
  DNS_RECORD_NAME="interview9.test"
  TGM_CLIENT_ID_DEFAULT="${VITE_TGM_CLIENT_ID:-}"
  VITE_TGM_URL="https://test.thegreymatter.ai"
else
  # Prod uses a dedicated RG and a dedicated CAE.
  RESOURCE_GROUP="interview9-prod"
  CONTAINER_ENV="cae-interview9-prod"
  CONTAINER_ENV_RG="interview9-prod"
  REGISTRY="acrtgmprod"
  TGM_AUTH_URL="https://auth.thegreymatter.ai"
  TGM_API_URL="https://api.thegreymatter.ai"
  TGM_AUTH_SERVICE_URL="https://tgm-auth-prod.jollysand-c6c0aad4.eastus.azurecontainerapps.io"
  TGM_FILE_SERVICE_URL="https://tgm-file-service-prod.jollysand-c6c0aad4.eastus.azurecontainerapps.io"
  TGM_COMMS_SERVICE_URL="https://tgm-communications-service-prod.jollysand-c6c0aad4.eastus.azurecontainerapps.io"
  CUSTOM_DOMAIN="interview9.thegreymatter.ai"
  DNS_RECORD_NAME="interview9"
  # Prod oauth client_id for Interview9.ai (currently live on eco-interview9ai-api).
  TGM_CLIENT_ID_DEFAULT="${VITE_TGM_CLIENT_ID:-client_q0nqB3jQtXe6ahdLpt5Bug}"
  VITE_TGM_URL="https://thegreymatter.ai"
fi

REGISTRY_SERVER="${REGISTRY}.azurecr.io"
APP_NAME="interview9ai"
# These container names must match what register-appstore.sh expects.
API_CONTAINER="eco-${APP_NAME}-api"
WEB_CONTAINER="eco-${APP_NAME}-web"
IMAGE_TAG="$(date +%Y%m%d-%H%M%S)"

echo ""
echo "=============================================="
echo "  Interview9.ai Full Stack Deployment"
echo "  Environment:   $ENV ($RESOURCE_GROUP)"
echo "  Registry:      $REGISTRY_SERVER"
echo "  Custom Domain: https://$CUSTOM_DOMAIN"
echo "=============================================="
echo ""

# ── Load .env file (server/.env preferred for runtime secrets) ──────────────
for env_path in "$SCRIPT_DIR/server/.env" "$SCRIPT_DIR/.env"; do
  if [[ -f "$env_path" ]]; then
    echo ">>> Loading env vars from $env_path"
    set -a
    while IFS= read -r line; do
      [[ -z "$line" || "$line" =~ ^# ]] && continue
      key="${line%%=*}"
      value="${line#*=}"
      value="${value#\"}" ; value="${value%\"}"
      value="${value#\'}" ; value="${value%\'}"
      export "$key=$value" 2>/dev/null || true
    done < "$env_path"
    set +a
  fi
done

# ── Ensure resource group exists ─────────────────────────────────────────────
if ! az group show --name "$RESOURCE_GROUP" &>/dev/null; then
  echo ">>> Creating resource group: $RESOURCE_GROUP"
  az group create --name "$RESOURCE_GROUP" --location eastus2 --output none
fi

# ── ACR Login & Credentials ─────────────────────────────────────────────────
echo ">>> Logging in to Azure Container Registry: $REGISTRY..."
az acr login --name "$REGISTRY" --output none

ACR_USERNAME=$(az acr credential show --name "$REGISTRY" --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name "$REGISTRY" --query "passwords[0].value" -o tsv)

# ── Get container environment default domain & verification id ──────────────
DEFAULT_DOMAIN=$(az containerapp env show \
  --name "$CONTAINER_ENV" --resource-group "$CONTAINER_ENV_RG" \
  --query "properties.defaultDomain" -o tsv 2>/dev/null || echo "")

VERIFICATION_ID=$(az containerapp env show \
  --name "$CONTAINER_ENV" --resource-group "$CONTAINER_ENV_RG" \
  --query "properties.customDomainConfiguration.customDomainVerificationId" -o tsv 2>/dev/null || echo "")

if [[ -z "$DEFAULT_DOMAIN" ]]; then
  echo "ERROR: Could not resolve default domain for CAE '$CONTAINER_ENV' in '$CONTAINER_ENV_RG'." >&2
  echo "  Verify the container apps environment exists and you have read access." >&2
  exit 1
fi

API_INTERNAL_FQDN="${API_CONTAINER}.internal.${DEFAULT_DOMAIN}"
WEB_DEFAULT_FQDN="${WEB_CONTAINER}.${DEFAULT_DOMAIN}"

# =============================================================================
# Helper: build, push, deploy a container
# =============================================================================
deploy_container() {
  local dockerfile="$1"
  local build_context="$2"
  local image_name="$3"
  local container_name="$4"
  local target_port="$5"
  local ingress="$6"
  local cpu="$7"
  local memory="$8"
  local env_vars="$9"
  shift 9
  local build_args="${1:-}"

  local full_image="${REGISTRY_SERVER}/${image_name}:${IMAGE_TAG}"

  echo ""
  echo "──────────────────────────────────────────────"
  echo "  Deploying: $container_name"
  echo "  Image:     $full_image"
  echo "  Port:      $target_port  |  Ingress: $ingress"
  echo "──────────────────────────────────────────────"

  # Build
  echo "  Building..."
  local docker_args=(
    --platform linux/amd64
    -t "$full_image"
    -t "${REGISTRY_SERVER}/${image_name}:latest"
    -f "$dockerfile"
  )
  if [[ -n "$build_args" ]]; then
    for arg in $build_args; do
      docker_args+=(--build-arg "$arg")
    done
  fi
  docker_args+=("$build_context")
  # Prevent MSYS/Git-Bash from converting /api → C:/Program Files/Git/api in build args
  MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL="*" docker build "${docker_args[@]}"

  # Push
  echo "  Pushing..."
  docker push "$full_image"
  docker push "${REGISTRY_SERVER}/${image_name}:latest"

  # Deploy (create or update)
  if az containerapp show --name "$container_name" --resource-group "$RESOURCE_GROUP" &>/dev/null; then
    echo "  Updating existing container app..."
    local update_args=(
      --name "$container_name"
      --resource-group "$RESOURCE_GROUP"
      --image "$full_image"
      --output none
    )
    if [[ -n "$env_vars" ]]; then
      update_args+=(--set-env-vars $env_vars)
    fi
    az containerapp update "${update_args[@]}"
  else
    echo "  Creating new container app..."
    local create_args=(
      --name "$container_name"
      --resource-group "$RESOURCE_GROUP"
      --environment "$CONTAINER_ENV"
      --image "$full_image"
      --registry-server "$REGISTRY_SERVER"
      --registry-username "$ACR_USERNAME"
      --registry-password "$ACR_PASSWORD"
      --target-port "$target_port"
      --ingress "$ingress"
      --transport http
      --min-replicas 0
      --max-replicas 3
      --cpu "$cpu"
      --memory "$memory"
      --output none
    )
    if [[ -n "$env_vars" ]]; then
      create_args+=(--env-vars $env_vars)
    fi
    az containerapp create "${create_args[@]}"
  fi

  local fqdn
  fqdn=$(az containerapp show \
    --name "$container_name" --resource-group "$RESOURCE_GROUP" \
    --query "properties.configuration.ingress.fqdn" -o tsv 2>/dev/null || echo "N/A")
  echo "  Live at: https://${fqdn}"
}

# =============================================================================
# Deploy API (internal — Express)
# =============================================================================
echo ""
echo ">>> Deploying API container..."

JWT_SECRET_VAL="${JWT_SECRET:-}"
if [[ -z "$JWT_SECRET_VAL" ]]; then
  echo "  WARNING: JWT_SECRET not set — generating an ephemeral one (sessions will not survive restarts)."
  JWT_SECRET_VAL=$(openssl rand -hex 32)
fi

API_ENV_VARS="NODE_ENV=production"
API_ENV_VARS="$API_ENV_VARS PORT=3001"
API_ENV_VARS="$API_ENV_VARS APP_ID=interview9"
API_ENV_VARS="$API_ENV_VARS TGM_CLIENT_ID=$TGM_CLIENT_ID_DEFAULT"
API_ENV_VARS="$API_ENV_VARS AUTH_SERVICE_URL=$TGM_AUTH_SERVICE_URL"
API_ENV_VARS="$API_ENV_VARS JWKS_URL=${TGM_AUTH_SERVICE_URL}/.well-known/jwks.json"
API_ENV_VARS="$API_ENV_VARS TGM_AUTH_URL=$TGM_AUTH_URL"
API_ENV_VARS="$API_ENV_VARS TGM_API_URL=$TGM_API_URL"
API_ENV_VARS="$API_ENV_VARS FILE_SERVICE_URL=$TGM_FILE_SERVICE_URL"
API_ENV_VARS="$API_ENV_VARS COMMS_SERVICE_URL=$TGM_COMMS_SERVICE_URL"
API_ENV_VARS="$API_ENV_VARS CORS_ORIGIN=https://${CUSTOM_DOMAIN}"
API_ENV_VARS="$API_ENV_VARS APP_BASE_URL=https://${CUSTOM_DOMAIN}"
API_ENV_VARS="$API_ENV_VARS JWT_SECRET=$JWT_SECRET_VAL"

[[ -n "${ANTHROPIC_API_KEY:-}" ]] && \
  API_ENV_VARS="$API_ENV_VARS ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY"
[[ -n "${FILE_SERVICE_INTERNAL_KEY:-}" ]] && \
  API_ENV_VARS="$API_ENV_VARS FILE_SERVICE_INTERNAL_KEY=$FILE_SERVICE_INTERNAL_KEY"
[[ -n "${COMMS_SERVICE_KEY:-}" ]] && \
  API_ENV_VARS="$API_ENV_VARS COMMS_SERVICE_KEY=$COMMS_SERVICE_KEY"
[[ -n "${COSMOS_CONNECTION_STRING:-}" ]] && \
  API_ENV_VARS="$API_ENV_VARS COSMOS_CONNECTION_STRING=$COSMOS_CONNECTION_STRING"
[[ -n "${COSMOS_DB_CONNECTION_STRING:-}" ]] && \
  API_ENV_VARS="$API_ENV_VARS COSMOS_DB_CONNECTION_STRING=$COSMOS_DB_CONNECTION_STRING"

deploy_container \
  "$SCRIPT_DIR/server/Dockerfile" \
  "$SCRIPT_DIR/server" \
  "ecosystem/${APP_NAME}-api" \
  "$API_CONTAINER" \
  "3001" \
  "internal" \
  "0.5" \
  "1Gi" \
  "$API_ENV_VARS" \
  ""

# =============================================================================
# Deploy Web (external — Vite build inside Docker + nginx envsubst proxy)
# =============================================================================
echo ""
echo ">>> Deploying Web container..."

WEB_ENV_VARS="API_BACKEND_URL=https://${API_INTERNAL_FQDN}"

WEB_BUILD_ARGS="VITE_API_URL=/api"
WEB_BUILD_ARGS="$WEB_BUILD_ARGS VITE_USE_MOCK_DATA=false"
WEB_BUILD_ARGS="$WEB_BUILD_ARGS VITE_AUTH_SERVICE_URL=$TGM_AUTH_SERVICE_URL"
WEB_BUILD_ARGS="$WEB_BUILD_ARGS VITE_FILE_SERVICE_URL=$TGM_FILE_SERVICE_URL"
WEB_BUILD_ARGS="$WEB_BUILD_ARGS VITE_TGM_CLIENT_ID=$TGM_CLIENT_ID_DEFAULT"
WEB_BUILD_ARGS="$WEB_BUILD_ARGS VITE_TGM_URL=$VITE_TGM_URL"
WEB_BUILD_ARGS="$WEB_BUILD_ARGS VITE_APP_BASE_URL=https://${CUSTOM_DOMAIN}"
WEB_BUILD_ARGS="$WEB_BUILD_ARGS VITE_API_BASE_URL=/api"
WEB_BUILD_ARGS="$WEB_BUILD_ARGS VITE_APP_ID=interview9"

deploy_container \
  "$SCRIPT_DIR/client/Dockerfile.azure" \
  "$SCRIPT_DIR/client" \
  "ecosystem/${APP_NAME}-web" \
  "$WEB_CONTAINER" \
  "80" \
  "external" \
  "0.25" \
  "0.5Gi" \
  "$WEB_ENV_VARS" \
  "$WEB_BUILD_ARGS"

# =============================================================================
# Custom Domain Binding (best effort — skips silently if DNS zone is missing)
# =============================================================================
echo ""
echo ">>> Configuring custom domain: $CUSTOM_DOMAIN"

DNS_ZONE_EXISTS=$(az network dns zone show \
  --name "$DNS_ZONE" --resource-group "$DNS_RESOURCE_GROUP" \
  --query "id" -o tsv 2>/dev/null || echo "")

if [[ -z "$DNS_ZONE_EXISTS" ]]; then
  echo "  WARNING: DNS zone '$DNS_ZONE' not found in '$DNS_RESOURCE_GROUP' — skipping DNS / cert binding."
  echo "  The web container is reachable at: https://${WEB_DEFAULT_FQDN}"
else
  # Step 1: TXT verification record
  EXISTING_TXT=$(az network dns record-set txt show \
    --zone-name "$DNS_ZONE" --resource-group "$DNS_RESOURCE_GROUP" \
    --name "asuid.$DNS_RECORD_NAME" --query "TXTRecords[0].value[0]" -o tsv 2>/dev/null || echo "")

  if [[ "$EXISTING_TXT" != "$VERIFICATION_ID" ]]; then
    echo "  Setting TXT verification record asuid.$DNS_RECORD_NAME"
    az network dns record-set txt delete \
      --zone-name "$DNS_ZONE" --resource-group "$DNS_RESOURCE_GROUP" \
      --name "asuid.$DNS_RECORD_NAME" --yes 2>/dev/null || true
    az network dns record-set txt add-record \
      --zone-name "$DNS_ZONE" --resource-group "$DNS_RESOURCE_GROUP" \
      --record-set-name "asuid.$DNS_RECORD_NAME" \
      --value "$VERIFICATION_ID" --output none
  fi

  # Step 2: CNAME
  echo "  Updating CNAME $DNS_RECORD_NAME → $WEB_DEFAULT_FQDN"
  az network dns record-set cname set-record \
    --zone-name "$DNS_ZONE" --resource-group "$DNS_RESOURCE_GROUP" \
    --record-set-name "$DNS_RECORD_NAME" \
    --cname "$WEB_DEFAULT_FQDN" --output none

  # Step 3: Hostname binding
  EXISTING_DOMAINS=$(az containerapp show \
    --name "$WEB_CONTAINER" --resource-group "$RESOURCE_GROUP" \
    --query "properties.configuration.ingress.customDomains[?name=='$CUSTOM_DOMAIN'].name" -o tsv 2>/dev/null || echo "")

  if [[ -z "$EXISTING_DOMAINS" ]]; then
    echo "  Adding hostname to container app..."
    az containerapp hostname add \
      --name "$WEB_CONTAINER" --resource-group "$RESOURCE_GROUP" \
      --hostname "$CUSTOM_DOMAIN" --output none

    echo "  Creating managed TLS certificate (this may take a few minutes)..."
    CERT_ID=$(az containerapp env certificate create \
      --name "$CONTAINER_ENV" --resource-group "$CONTAINER_ENV_RG" \
      --hostname "$CUSTOM_DOMAIN" --validation-method CNAME \
      --query "id" -o tsv 2>/dev/null || echo "")

    if [[ -n "$CERT_ID" ]]; then
      az containerapp hostname bind \
        --name "$WEB_CONTAINER" --resource-group "$RESOURCE_GROUP" \
        --hostname "$CUSTOM_DOMAIN" \
        --environment "$CONTAINER_ENV" \
        --output none 2>/dev/null || echo "  NOTE: Cert binding may take a moment to propagate."
    else
      echo "  WARNING: Certificate creation failed; bind manually with:"
      echo "    az containerapp env certificate create --name $CONTAINER_ENV --resource-group $CONTAINER_ENV_RG --hostname $CUSTOM_DOMAIN --validation-method CNAME"
    fi
  else
    echo "  Custom domain already bound."
  fi
fi

# =============================================================================
# Verify final revision is healthy
# =============================================================================
echo ""
echo ">>> Verifying latest revisions are healthy..."
for app in "$API_CONTAINER" "$WEB_CONTAINER"; do
  STATE=$(az containerapp revision list \
    --name "$app" --resource-group "$RESOURCE_GROUP" \
    --query "sort_by([?properties.active], &properties.createdTime)[-1].{health:properties.healthState,running:properties.runningState,name:name}" \
    -o json 2>/dev/null || echo "{}")
  echo "  $app: $STATE"
done

# =============================================================================
# Register in TGM App Store (idempotent)
# =============================================================================
if [[ -n "${TGM_ADMIN_EMAIL:-}" && -n "${TGM_ADMIN_PASSWORD:-}" ]]; then
  echo ""
  echo ">>> Registering in TGM App Store..."
  "$SCRIPT_DIR/register-appstore.sh" --env "$ENV"
else
  echo ""
  echo ">>> Skipping App Store registration (set TGM_ADMIN_EMAIL and TGM_ADMIN_PASSWORD to enable)"
fi

# =============================================================================
# Summary
# =============================================================================
WEB_FQDN=$(az containerapp show \
  --name "$WEB_CONTAINER" --resource-group "$RESOURCE_GROUP" \
  --query "properties.configuration.ingress.fqdn" -o tsv 2>/dev/null || echo "N/A")
API_FQDN=$(az containerapp show \
  --name "$API_CONTAINER" --resource-group "$RESOURCE_GROUP" \
  --query "properties.configuration.ingress.fqdn" -o tsv 2>/dev/null || echo "N/A")

echo ""
echo "=============================================="
echo "  Interview9.ai Deployment Complete!"
echo "=============================================="
echo "  Environment:      $ENV"
echo "  Custom Domain:    https://${CUSTOM_DOMAIN}"
echo "  Web (raw FQDN):   https://${WEB_FQDN}"
echo "  API (internal):   https://${API_FQDN}"
echo "  Image Tag:        $IMAGE_TAG"
echo "=============================================="
echo ""
