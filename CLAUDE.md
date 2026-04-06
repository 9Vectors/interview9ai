# Interview9.ai

## What This App Does
Interview9.ai is a structured interview intelligence platform built on the Falcone methodology. It provides a rigorous, repeatable framework for evaluating candidates through 96 structured questions mapped to 13 Measurement attributes (Measurement13).

## Primary Vectors
- **People** -- candidate evaluation, talent assessment, hiring intelligence
- **Execution** -- structured process adherence, scoring consistency, decision quality

## Core Capabilities
- **96 Structured Questions**: Full Falcone-method question bank organized by competency area
- **Measurement13 Attributes**: 13 measurable candidate dimensions scored per interview
- **AI-Powered Analysis**: Claude-based real-time analysis of candidate responses
- **Candidate Management**: Track candidates through multi-stage interview pipelines
- **Interview Scoring**: Quantitative + qualitative scoring with confidence levels
- **Vector/Theme Mapping**: Each question and score maps to TGM ontology vectors

## Architecture
- **Client**: React 18 + Vite + Tailwind CSS + Zustand state management
- **Server**: Node.js/Express (plain JavaScript, no TypeScript)
- **Storage**: Currently in-memory -- needs migration to Cosmos DB
- **AI**: Anthropic Claude SDK for response analysis
- **Auth**: JWT via Azure AD B2C (jwks-rsa validation)

## Key API Routes
- `/api/v1/candidates` -- candidate CRUD
- `/api/v1/interviews` -- interview sessions and scoring
- `/api/v1/ai` -- AI-powered response analysis (rate-limited: 10/min)
- `/api/v1/platform` -- platform integration endpoints
- `/api/vectors` -- vector/theme mapping

## Health Endpoints
- `/health/live` -- liveness probe
- `/health/ready` -- readiness probe

## Ports
- API server: 3001
- Client dev server: 5173

## Known Gaps / Migration Needs
1. **Storage**: In-memory storage must be replaced with Cosmos DB for production
2. **Redis**: ioredis dependency exists but needs proper connection config
3. **Auth**: Auth middleware scaffolded but needs full Azure AD B2C integration
4. **Observability**: No structured logging or tracing yet
5. **Scenario Testing**: No test suite -- needs business scenario coverage

## TGM Ecosystem Context
Interview9 is part of the TGM Ecosystem App Store. It consumes shared ontology/vector services and produces structured people-assessment data that feeds into broader TGM intelligence surfaces (dashboards, reports, executive views).
