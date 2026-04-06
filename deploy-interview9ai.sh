#!/usr/bin/env bash
# =============================================================================
# Interview9ai - Full Stack Deployment
# Deploys the app via the ecosystem deploy.sh
# =============================================================================
# Usage:
#   ./deploy-interview9ai.sh [--env dev|prod]
#
# This script:
#   1. Calls the ecosystem deploy.sh to build and deploy the API + Web containers
#
# Examples:
#   ./deploy-interview9ai.sh              # deploys to dev
#   ./deploy-interview9ai.sh --env prod   # deploys to prod
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ECOSYSTEM_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

# ── Parse arguments ──────────────────────────────────────────────────────────
ENV="dev"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env)  ENV="$2"; shift 2 ;;
    --help|-h)
      sed -n '2,14p' "$0"
      exit 0 ;;
    *)
      echo "ERROR: Unknown argument: $1" >&2; exit 1 ;;
  esac
done

if [[ "$ENV" != "dev" && "$ENV" != "prod" ]]; then
  echo "ERROR: Environment must be 'dev' or 'prod', got: $ENV" >&2
  exit 1
fi

echo ""
echo "=============================================="
echo "  Interview9ai Full Stack Deployment"
echo "  Environment: $ENV"
echo "=============================================="

# ── Deploy the application via ecosystem deploy.sh ───────────────────────────
echo ""
echo ">>> Deploying Interview9ai application..."
"$ECOSYSTEM_DIR/deploy.sh" "$SCRIPT_DIR" --env "$ENV"

# ── Register in TGM App Store (idempotent — skips if already registered) ─────
if [[ -n "${TGM_ADMIN_EMAIL:-}" && -n "${TGM_ADMIN_PASSWORD:-}" ]]; then
  echo ""
  echo ">>> Registering in TGM App Store..."
  "$SCRIPT_DIR/register-appstore.sh" --env "$ENV"
else
  echo ""
  echo ">>> Skipping App Store registration (set TGM_ADMIN_EMAIL and TGM_ADMIN_PASSWORD to enable)"
fi
