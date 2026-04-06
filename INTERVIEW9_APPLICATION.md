# Interview9.ai — Agentic AI Application Definition

## SECTION A: IDENTITY

**AGENT NAME:** Interview9.ai
**TAGLINE:** AI-powered structured interview intelligence that transforms hiring from gut instinct to data-driven 9Vectors evaluation
**FUNCTION:** Structured Interview Intelligence & Hiring Assessment Engine
**CATEGORY:** Talent & Organization

---

## SECTION B: 9 VECTORS MAPPING

**PRIMARY VECTORS:** PEOPLE (V2), EXECUTION (V6), EXPECTATIONS (V7)
**SECONDARY VECTORS:** STRATEGY (V4), OPERATIONS (V5), GOVERNANCE (V8), ENTITY (V9), MARKET (V1), FINANCE (V3)
**VECTOR COVERAGE:** 9 of 9

### Sub-Vectors Engaged:
- **V2 People** → Culture, Employee Characteristics, Communication, Leadership, Org. Design
- **V6 Execution** → Measurement, Performance
- **V7 Expectations** → Employees, All Stakeholders, Board and Shareholders
- **V4 Strategy** → General Strategy, Strategic Evaluation
- **V5 Operations** → Processes, Infrastructure, Documentation
- **V8 Governance** → Practices, Principles
- **V9 Entity** → Contracts, Liability and Risk
- **V1 Market** → Customer, Competition, Positioning
- **V3 Finance** → Financial Model, Forecasting

### Diagnostic Themes Activated:
- **Employee Characteristics** → Strengths, Aptitude, Critical Thinking, Humility, Authenticity, Ethics, Passion, Resource State, Problem Solving, Level of Trust, Level of Accountability, Attention to Results, Fear of Conflict
- **Culture** → Teamwork, Fostering Positive Culture, Values, Interaction, Work Environment, Negative Behaviors, Politics & Power
- **Leadership** → Visionary Leadership, Dealing with Conflict, Setting/Achieving Objectives, Managing Problems, Organizational Leader, Listen and Empowering, Leadership Team Strengths
- **Performance** → Overall, Finance, Sales, Production, Client Services
- **Measurement** → Performance Measurement Systems, Overall, Sales

---

## SECTION C: CORE CAPABILITIES

### Application Purpose
Interview9.ai replaces unstructured, gut-instinct hiring interviews with AI-powered structured behavioral assessment based on Paul Falcone's "96 Great Interview Questions" methodology. It aligns every interview question to the 9Vectors framework and Measurement13 leadership attributes, enabling data-driven hiring decisions with cross-vector evaluation, reference triangulation, and institutional memory that compounds over time.

### Primary Functions
1. **Question Library** — 96+ structured behavioral questions mapped to 9Vectors themes and Measurement13 attributes
2. **Interview Builder** — AI-generated interview plans tailored to role level with Falcone methodology progression
3. **STAR Scoring** — Situation-Task-Action-Result weighted evaluation with quantified candidate scoring
4. **Measurement13 Integration** — 13 leadership attribute scoring from interview data
5. **Reference Triangulation** — Structured reference checking with validation gap analysis
6. **Pattern Detection** — AI-powered identification of rebel producers, strategic gaps, and cultural risk
7. **Hiring Decision Packages** — Board-ready candidate evaluation reports

### Platform Integrations
- **TheGreyMatter.ai:** Task sync, dashboard roll-up, institutional hiring memory
- **9Vectors.ai:** Full People vector assessment framework; cross-vector candidate evaluation
- **Measurement13.ai:** 13 leadership attribute scoring from interview data (Three C's: Competence, Character, Chemistry)
- **OrgDesign9.ai:** Role design validation, organizational fit assessment

### Cross-Application Data Flows
- **FEEDS INTO:** Measurement13.ai (leadership scores), OrgDesign9.ai (hiring recommendations), Culture9.ai (cultural fit data), TheGreyMatter.ai (hiring decisions)
- **RECEIVES FROM:** 9Vectors.ai (organizational vector scores), Measurement13.ai (existing leadership profiles), OrgDesign9.ai (role requirements)

---

## SECTION D: DATA REQUIREMENTS

### Required Data Sources
- Interview responses and scores (primary — generated within app)
- Job descriptions and role requirements
- Candidate resumes and application data

### Optional Data Enrichment
- HRIS (Workday, ADP) — existing employee profiles for culture baseline
- ATS (Greenhouse, Lever) — candidate pipeline data
- Reference check responses
- Performance reviews of past hires (outcome tracking)

---

## SECTION E: TRIGGERS, CADENCE & USERS

### When (Triggers & Cadence)
- **On-demand:** New candidate enters pipeline — generate interview plan
- **Pre-interview:** Interview guide with STAR-aligned questions delivered to interviewer
- **Post-interview:** Scoring prompt with red flag detection
- **Weekly:** Pipeline health digest with AI insights
- **Quarterly:** Hiring outcome analysis — which interview approaches predicted success

### Who (Primary Users)
- CHRO, VP of People
- Hiring Managers
- Interviewers
- PE Operating Partners (executive hiring oversight)
- Recruiters

---

## SECTION F: KEY OUTPUTS

### Dashboards & Visualizations
- Interview Intelligence Dashboard — pipeline health, scoring trends, upcoming interviews
- Candidate Radar Charts — Measurement13 leadership profile visualization

### Reports & Exports
- Candidate Summary Report (PDF) — complete evaluation with STAR scores and M13 profile
- Hiring Decision Package (PDF/PPT) — board-ready recommendation with cross-vector analysis
- Pipeline Health Report (Excel) — conversion rates and bottleneck analysis

### Alerts & Notifications
- Rebel Producer Alert — high V6 Performance + low V2 Culture pattern detection
- Validation Gap Alert — reference data contradicts self-reported achievements
- Interview Reminder — upcoming interview with preparation guide
- Scoring Overdue — post-interview scoring not yet completed

### AI-Generated Deliverables
- Interview plans tailored to role level and Falcone methodology
- Prescriptive hiring recommendations with confidence scores
- Cross-vector gap analysis for candidate evaluation
- Reference triangulation validation reports

---

## SECTION G: ACCOUNTABILITY FRAMEWORK

### Task Types Generated
- `interview9.schedule_interview` — Schedule structured interview (assigned to: Hiring Manager)
- `interview9.score_candidate` — Complete post-interview scoring (assigned to: Interviewer)
- `interview9.reference_check` — Complete reference validation (assigned to: Recruiter)
- `interview9.review_recommendation` — Review AI hiring recommendation (assigned to: Hiring Manager)

### Tracking & Escalation
- Scoring completion tracked — escalate if not completed within 24 hours post-interview
- Pipeline bottleneck detection — alert when candidates stall at any stage > 5 days

### Outcome Metrics
- Time-to-hire from screening to offer
- Interview-to-offer conversion rate
- Scoring completion rate (% of interviews scored within 24 hours)
- Hiring quality score (90/180/365-day performance of hires)
- Prediction accuracy (AI recommendation vs. actual outcome)

**ROI IMPACT:** Reduce mis-hires 60%; structured interviews are 2x more predictive than unstructured; institutional memory compounds hiring intelligence over time

---

## SECTION H: KEY PAGES (React Application)

### Pages
- **Dashboard** — Pipeline health, KPI metrics, upcoming interviews, rebel producer alerts
- **Question Library** — 96+ questions with 9Vectors mapping, STAR guidance, red flags, and Measurement13 alignment
- **Interview Builder** — Auto-generate or manually build interview plans by role level
- **Candidates** — Track candidates through the structured interview pipeline
- **Scoring** — STAR framework evaluation with Measurement13 attribute scoring and radar charts
- **Reference Checks** — Structured reference validation with triangulation protocol
- **AI Insights** — Claude-powered pattern detection, gap analysis, and recommendations
- **Reports** — Generate candidate summaries, hiring decision packages, and pipeline reports
- **Settings** — Organization config, platform integrations, notification preferences, security/compliance

### Navigation (Sidebar)
```
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Question Library', href: '/questions', icon: BookOpen },
  { name: 'Interview Builder', href: '/builder', icon: ClipboardList },
  { name: 'Candidates', href: '/candidates', icon: Users },
  { name: 'Scoring', href: '/scoring', icon: Star },
  { name: 'Reference Checks', href: '/references', icon: PhoneCall },
  { type: 'divider' },
  { name: 'AI Insights', href: '/ai-insights', icon: Brain },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];
```

---

## SECTION I: COMPETITIVE DIFFERENTIATION

**WHAT COMPETITORS LACK:** ATS platforms (Greenhouse, Lever) track candidates but don't provide structured evaluation methodology. Interview tools (HireVue, BrightHire) record interviews but don't map responses to a systematic business framework. No existing tool connects interview evaluation to a comprehensive business intelligence schema.

**WHAT THIS APP DELIVERS:** The only interview platform that maps behavioral interview responses to the 9Vectors diagnostic framework, scores candidates against Measurement13 leadership attributes, and builds institutional hiring memory that compounds over time. Cross-vector evaluation catches what traditional interviews miss — a strong performer who will be a cultural disaster, a strong leader who lacks strategic acumen.

**REPLACES/IMPROVES:** Replaces unstructured interviews ($500K+ in mis-hire costs), fragmented ATS scoring, consultant-led executive assessment ($25K-$75K per search), and ad-hoc reference checking with systematic, AI-enhanced evaluation.

---

## Training Data Source

Based on Paul Falcone's *96 Great Interview Questions to Ask Before You Hire* (3rd Edition, AMACOM/HarperCollins Leadership, 2018). Full training document alignment available in `96_Great_Interview_Questions_TheGreyMatter_Training_v2.md`.
