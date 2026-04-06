#!/usr/bin/env bash
# =============================================================================
# Interview9ai - TGM App Store Registration
# Registers Interview9ai in the TGM App Store catalog (dev or prod)
# =============================================================================
# Usage:
#   ./register-appstore.sh --env dev|prod
#
# Required environment variables:
#   TGM_ADMIN_EMAIL     - Super admin email
#   TGM_ADMIN_PASSWORD  - Super admin password
#
# This script is idempotent for the catalog entry — it will check if the app
# already exists and skip or update accordingly.
#
# Examples:
#   TGM_ADMIN_EMAIL=admin@thegreymatter.ai TGM_ADMIN_PASSWORD=secret \
#     ./register-appstore.sh --env dev
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Parse arguments ──────────────────────────────────────────────────────────
ENV=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env)  ENV="$2"; shift 2 ;;
    --help|-h)
      sed -n '2,17p' "$0"
      exit 0 ;;
    *)
      echo "ERROR: Unknown argument: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$ENV" ]]; then
  echo "ERROR: --env is required (dev or prod)" >&2
  exit 1
fi
if [[ "$ENV" != "dev" && "$ENV" != "prod" ]]; then
  echo "ERROR: Environment must be 'dev' or 'prod', got: $ENV" >&2
  exit 1
fi

# ── Validate prerequisites ───────────────────────────────────────────────────
: "${TGM_ADMIN_EMAIL:?ERROR: Set TGM_ADMIN_EMAIL environment variable}"
: "${TGM_ADMIN_PASSWORD:?ERROR: Set TGM_ADMIN_PASSWORD environment variable}"

command -v curl >/dev/null || { echo "ERROR: curl is required" >&2; exit 1; }
command -v jq >/dev/null   || { echo "ERROR: jq is required" >&2; exit 1; }

# ── Environment-specific settings ────────────────────────────────────────────
if [[ "$ENV" == "dev" ]]; then
  API_BASE_URL="https://api.test.thegreymatter.ai"
  RESOURCE_GROUP="interview9-dev"
  WEB_CONTAINER="eco-interview9ai-web"
  API_CONTAINER="eco-interview9ai-api"
  CUSTOM_DOMAIN="interview9.test.thegreymatter.ai"
else
  API_BASE_URL="https://api.thegreymatter.ai"
  RESOURCE_GROUP="TGM3-prod"
  WEB_CONTAINER="eco-interview9ai-web"
  API_CONTAINER="eco-interview9ai-api"
  CUSTOM_DOMAIN="interview9.thegreymatter.ai"
fi

# ── Resolve container FQDNs ──────────────────────────────────────────────────
echo ""
echo "=============================================="
echo "  Interview9ai App Store Registration"
echo "  Environment: $ENV"
echo "  API:         $API_BASE_URL"
echo "=============================================="
echo ""

echo ">>> Resolving container FQDNs..."
WEB_FQDN=$(az containerapp show \
  --name "$WEB_CONTAINER" --resource-group "$RESOURCE_GROUP" \
  --query "properties.configuration.ingress.fqdn" -o tsv 2>/dev/null || echo "")

if [[ -z "$WEB_FQDN" ]]; then
  echo "ERROR: Web container '$WEB_CONTAINER' not found in $RESOURCE_GROUP." >&2
  echo "  Deploy the app first: ./deploy-interview9ai.sh --env $ENV" >&2
  exit 1
fi

# Use custom domain if set, otherwise fall back to Azure FQDN
if [[ -n "${CUSTOM_DOMAIN:-}" ]]; then
  APP_LAUNCH_URL="https://${CUSTOM_DOMAIN}"
  APP_HEALTH_URL="https://${CUSTOM_DOMAIN}/health"
  APP_REDIRECT_URI="https://${CUSTOM_DOMAIN}/auth/callback"
  APP_API_URL="https://${CUSTOM_DOMAIN}/api"
else
  APP_LAUNCH_URL="https://${WEB_FQDN}"
  APP_HEALTH_URL="https://${WEB_FQDN}/health"
  APP_REDIRECT_URI="https://${WEB_FQDN}/auth/callback"
  APP_API_URL="https://${WEB_FQDN}/api"
fi

echo "  Web:  $APP_LAUNCH_URL"
echo "  API:  $APP_API_URL"
echo ""

# ── App configuration ────────────────────────────────────────────────────────
APP_ID="interview9ai"
APP_NAME="Interview9.ai"
APP_SHORT_DESC="AI-Powered Interview Intelligence Platform — structured behavioral interviewing with Falcone methodology, STAR scoring, Measurement13 alignment, and 9 Vectors framework integration."
APP_LONG_DESC="## Interview9.ai - AI-Powered Interview Intelligence Platform

Interview9.ai provides comprehensive interview intelligence powered by AI:

- **9-Vector Interview Mapping** — Align interview questions and candidate assessments across all 9 business vectors
- **96+ Falcone Methodology Questions** — Structured behavioral interview library based on proven hiring science
- **STAR Framework Scoring** — Situation, Task, Action, Result scoring with AI-assisted evaluation
- **Measurement13 Leadership Assessment** — Quantitative leadership competency scoring across 13 dimensions
- **AI-Powered Candidate Insights** — Real-time analysis of candidate responses with pattern detection
- **Rebel Producer Detection** — Identify high-impact unconventional talent using behavioral indicators
- **Board-Ready Hiring Reports** — Executive-quality candidate evaluations exportable to PDF and PowerPoint

Built for HR Directors, Hiring Managers, Recruiters, and Interview Panels."

APP_VERSION="1.0.0"
APP_CATEGORY="people"
APP_PRICE_PER_USER=10.00
APP_STORAGE_BYTES=10737418240  # 10 GB
APP_OVERAGE_PER_GB=0.50
APP_TRIAL_DAYS=30
APP_DISPLAY_ORDER=110
APP_IS_FEATURED=true
APP_MIN_ROLE="user"
APP_SUPPORT_EMAIL="support@thegreymatter.ai"

OAUTH_CLIENT_NAME="Interview9ai $(echo "$ENV" | tr '[:lower:]' '[:upper:]')"

ROLE_DEFINITIONS='{
  "app_roles": ["admin", "manager", "recruiter", "viewer"],
  "mapping": {
    "super_admin": "admin",
    "org_admin": "admin",
    "manager": "manager",
    "user": "recruiter"
  }
}'

# =============================================================================
# Step 1: Authenticate
# =============================================================================
echo "[1/4] Authenticating as ${TGM_ADMIN_EMAIL}..."

LOGIN_TMPFILE=$(mktemp)
trap 'rm -f "$LOGIN_TMPFILE"' EXIT
jq -n --arg email "$TGM_ADMIN_EMAIL" --arg password "$TGM_ADMIN_PASSWORD" \
  '{email: $email, password: $password}' > "$LOGIN_TMPFILE"

LOGIN_RESPONSE=$(curl -s -X POST "${API_BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "@${LOGIN_TMPFILE}" 2>&1) || {
  echo "ERROR: Authentication request failed" >&2
  echo "$LOGIN_RESPONSE" >&2
  exit 1
}

ACCESS_TOKEN=$(echo "${LOGIN_RESPONSE}" | jq -r '.access_token')
if [[ -z "$ACCESS_TOKEN" || "$ACCESS_TOKEN" == "null" ]]; then
  echo "ERROR: Authentication failed — could not extract access_token" >&2
  echo "$LOGIN_RESPONSE" >&2
  exit 1
fi
echo "  Authenticated successfully."

# =============================================================================
# Step 2: Check if app already exists → update or create
# =============================================================================
echo "[2/4] Checking if ${APP_ID} already exists in catalog..."

EXISTING_APP=$(curl -sf -X GET "${API_BASE_URL}/apps/${APP_ID}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" 2>/dev/null || echo "")

if [[ -n "$EXISTING_APP" ]]; then
  EXISTING_APP_NAME=$(echo "$EXISTING_APP" | jq -r '.app_name // empty')
  if [[ -n "$EXISTING_APP_NAME" ]]; then
    EXISTING_CLIENT_ID=$(echo "$EXISTING_APP" | jq -r '.client_id')
    APP_INTERNAL_ID=$(echo "$EXISTING_APP" | jq -r '.id')
    EXISTING_STATUS=$(echo "$EXISTING_APP" | jq -r '.status')
    EXISTING_LAUNCH=$(echo "$EXISTING_APP" | jq -r '.launch_url')
    echo ""
    echo "=============================================="
    echo "  App already registered — nothing to do"
    echo "=============================================="
    echo "  App ID:        $APP_ID"
    echo "  App Name:      $EXISTING_APP_NAME"
    echo "  Internal ID:   $APP_INTERNAL_ID"
    echo "  Status:        $EXISTING_STATUS"
    echo "  OAuth Client:  $EXISTING_CLIENT_ID"
    echo "  Launch URL:    $EXISTING_LAUNCH"
    echo "=============================================="
    exit 0
  fi
fi

# =============================================================================
# Step 3: Create OAuth client + catalog entry (app does not exist yet)
# =============================================================================
echo "[3/4] Creating OAuth client: ${OAUTH_CLIENT_NAME}..."

OAUTH_RESPONSE=$(curl -sf -X POST "${API_BASE_URL}/oauth/clients" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -d "{
    \"client_name\": \"${OAUTH_CLIENT_NAME}\",
    \"redirect_uris\": [\"http://localhost:5173/auth/callback\", \"https://interview9.test.thegreymatter.ai/auth/callback\", \"https://interview9.thegreymatter.ai/auth/callback\"],
    \"is_first_party\": true,
    \"allowed_grants\": [\"authorization_code\", \"refresh_token\"],
    \"allowed_scopes\": [\"openid\", \"profile\", \"email\"]
  }" 2>&1) || {
  echo "ERROR: Failed to create OAuth client" >&2
  echo "$OAUTH_RESPONSE" >&2
  exit 1
}

CLIENT_ID=$(echo "${OAUTH_RESPONSE}" | jq -r '.client_id')
CLIENT_SECRET=$(echo "${OAUTH_RESPONSE}" | jq -r '.client_secret')

if [[ -z "$CLIENT_ID" || "$CLIENT_ID" == "null" ]]; then
  echo "ERROR: Failed to create OAuth client" >&2
  echo "$OAUTH_RESPONSE" >&2
  exit 1
fi

echo "  OAuth client created: ${CLIENT_ID}"
echo ""
echo "  ┌──────────────────────────────────────────────────────────┐"
echo "  │  SAVE THIS — client_secret is shown only once:          │"
echo "  │  client_id:     ${CLIENT_ID}"
echo "  │  client_secret: ${CLIENT_SECRET}"
echo "  └──────────────────────────────────────────────────────────┘"
echo ""

echo "  Creating app catalog entry: ${APP_NAME}..."

APP_RESPONSE=$(curl -sf -X POST "${API_BASE_URL}/apps" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -d "{
    \"app_id\": \"${APP_ID}\",
    \"app_name\": \"${APP_NAME}\",
    \"client_id\": \"${CLIENT_ID}\",
    \"short_description\": \"${APP_SHORT_DESC}\",
    \"long_description\": $(echo "${APP_LONG_DESC}" | jq -Rs .),
    \"launch_url\": \"${APP_LAUNCH_URL}\",
    \"api_url\": \"${APP_API_URL}\",
    \"role_definitions\": ${ROLE_DEFINITIONS},
    \"price_per_user_monthly\": ${APP_PRICE_PER_USER},
    \"default_storage_bytes\": ${APP_STORAGE_BYTES},
    \"overage_price_per_gb\": ${APP_OVERAGE_PER_GB},
    \"trial_period_days\": ${APP_TRIAL_DAYS},
    \"category\": \"${APP_CATEGORY}\",
    \"display_order\": ${APP_DISPLAY_ORDER},
    \"min_tgm_role\": \"${APP_MIN_ROLE}\",
    \"status\": \"active\",
    \"is_featured\": ${APP_IS_FEATURED},
    \"health_check_url\": \"${APP_HEALTH_URL}\",
    \"support_email\": \"${APP_SUPPORT_EMAIL}\",
    \"version\": \"${APP_VERSION}\"
  }" 2>&1) || {
  echo "ERROR: Failed to create app catalog entry" >&2
  echo "$APP_RESPONSE" >&2
  exit 1
}

APP_INTERNAL_ID=$(echo "${APP_RESPONSE}" | jq -r '.id')
if [[ -z "$APP_INTERNAL_ID" || "$APP_INTERNAL_ID" == "null" ]]; then
  echo "ERROR: Failed to create app" >&2
  echo "$APP_RESPONSE" >&2
  exit 1
fi

echo "  App created: ${APP_INTERNAL_ID}"

# =============================================================================
# Step 4: Verify
# =============================================================================
echo "[4/4] Verifying app in catalog..."

VERIFY_RESPONSE=$(curl -sf -X GET "${API_BASE_URL}/apps/${APP_ID}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" 2>&1) || {
  echo "WARNING: Could not verify app" >&2
  VERIFY_RESPONSE="{}"
}

VERIFIED_NAME=$(echo "$VERIFY_RESPONSE" | jq -r '.app_name // "unknown"')
VERIFIED_STATUS=$(echo "$VERIFY_RESPONSE" | jq -r '.status // "unknown"')
VERIFIED_LAUNCH=$(echo "$VERIFY_RESPONSE" | jq -r '.launch_url // "unknown"')
VERIFIED_CLIENT=$(echo "$VERIFY_RESPONSE" | jq -r '.client_id // "unknown"')

echo ""
echo "=============================================="
echo "  App Store Registration Complete"
echo "=============================================="
echo "  Environment:   $ENV"
echo "  App ID:        $APP_ID"
echo "  App Name:      $VERIFIED_NAME"
echo "  Internal ID:   $APP_INTERNAL_ID"
echo "  Status:        $VERIFIED_STATUS"
echo "  OAuth Client:  $VERIFIED_CLIENT"
echo "  Launch URL:    $VERIFIED_LAUNCH"
echo "  Price:         \$${APP_PRICE_PER_USER}/user/month"
echo "  Trial:         ${APP_TRIAL_DAYS} days"
echo "=============================================="
echo ""
