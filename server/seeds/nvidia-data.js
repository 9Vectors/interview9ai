/**
 * Interview9.ai — NVIDIA Seed Data
 * Realistic hiring process data based on NVIDIA's actual organizational structure.
 *
 * Covers: hiring processes, candidates, interviews, scores, references, and AI analyses.
 * Organization-scoped with orgId for multi-tenant isolation.
 */

const ORG_ID = 'org-nvidia-demo';

const now = () => new Date().toISOString();

// ═══════════════════════════════════════════════════════════════
// HIRING PROCESSES
// ═══════════════════════════════════════════════════════════════

const hiringProcesses = [
  {
    id: 'hp-gpu-architect',
    orgId: ORG_ID,
    title: 'Senior GPU Architect',
    department: 'Engineering — GPU Architecture',
    level: 'Executive',
    location: 'Santa Clara, CA',
    status: 'active',
    priority: 'critical',
    hiringManager: 'VP of GPU Architecture',
    recruiter: 'Senior Technical Recruiter',
    targetStartDate: '2026-06-01',
    openDate: '2026-01-15',
    description: 'Lead next-generation GPU architecture design. Responsible for defining compute, memory hierarchy, and interconnect architecture for post-Blackwell GPUs. Reports to SVP of Hardware Engineering.',
    requirements: [
      'PhD in EE/CS or equivalent experience',
      '12+ years GPU/CPU microarchitecture design',
      'Proven track record shipping commercial silicon',
      'Leadership of 50+ person architecture teams',
      'Deep knowledge of AI/ML workload characteristics',
    ],
    compensation: {
      baseSalaryRange: { min: 450000, max: 650000, currency: 'USD' },
      equityRange: { min: 2000000, max: 5000000, vestingYears: 4 },
      bonus: '30-50% target',
    },
    candidateCount: 4,
    interviewStage: 'final-round',
    vectorScores: {
      v1: { name: 'Leadership', weight: 0.20 },
      v2: { name: 'Culture Fit', weight: 0.15 },
      v3: { name: 'Technical Depth', weight: 0.25 },
      v4: { name: 'Strategic Vision', weight: 0.15 },
      v5: { name: 'Communication', weight: 0.10 },
      v6: { name: 'Performance Track Record', weight: 0.15 },
    },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'hp-ai-researcher',
    orgId: ORG_ID,
    title: 'AI Research Scientist',
    department: 'NVIDIA Research',
    level: 'Senior',
    location: 'Santa Clara, CA (Hybrid)',
    status: 'active',
    priority: 'high',
    hiringManager: 'Director of AI Research',
    recruiter: 'Research Recruiting Lead',
    targetStartDate: '2026-05-01',
    openDate: '2026-02-01',
    description: 'Conduct frontier AI research in foundation models, reasoning, and multimodal AI. Publish at top venues and translate research into NVIDIA platform capabilities.',
    requirements: [
      'PhD in ML/AI/CS from top-tier program',
      '5+ years post-PhD research experience',
      'Strong publication record (NeurIPS, ICML, ICLR)',
      'Experience with large-scale distributed training',
      'Ability to translate research to products',
    ],
    compensation: {
      baseSalaryRange: { min: 350000, max: 500000, currency: 'USD' },
      equityRange: { min: 1500000, max: 3000000, vestingYears: 4 },
      bonus: '20-35% target',
    },
    candidateCount: 0,
    interviewStage: 'sourcing',
    vectorScores: {
      v1: { name: 'Research Impact', weight: 0.25 },
      v2: { name: 'Culture Fit', weight: 0.10 },
      v3: { name: 'Technical Depth', weight: 0.30 },
      v4: { name: 'Innovation', weight: 0.15 },
      v5: { name: 'Collaboration', weight: 0.10 },
      v6: { name: 'Publication Record', weight: 0.10 },
    },
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'hp-supply-chain-director',
    orgId: ORG_ID,
    title: 'Supply Chain Director',
    department: 'Operations — Supply Chain',
    level: 'Senior',
    location: 'Santa Clara, CA',
    status: 'active',
    priority: 'high',
    hiringManager: 'VP of Operations',
    recruiter: 'Operations Recruiting Lead',
    targetStartDate: '2026-07-01',
    openDate: '2026-03-01',
    description: 'Lead supply chain strategy for GPU and networking products. Manage relationships with TSMC, SK Hynix, and assembly partners. Drive capacity planning, risk mitigation, and cost optimization.',
    requirements: [
      'MBA or MS in Supply Chain / Operations',
      '15+ years semiconductor supply chain experience',
      'Direct experience with TSMC, Samsung, or SK Hynix',
      'Track record managing $1B+ procurement budgets',
      'Crisis management during supply disruptions',
    ],
    compensation: {
      baseSalaryRange: { min: 300000, max: 450000, currency: 'USD' },
      equityRange: { min: 1000000, max: 2500000, vestingYears: 4 },
      bonus: '25-40% target',
    },
    candidateCount: 0,
    interviewStage: 'sourcing',
    vectorScores: {
      v1: { name: 'Leadership', weight: 0.20 },
      v2: { name: 'Culture Fit', weight: 0.15 },
      v3: { name: 'Domain Expertise', weight: 0.25 },
      v4: { name: 'Strategic Thinking', weight: 0.15 },
      v5: { name: 'Stakeholder Management', weight: 0.15 },
      v6: { name: 'Performance Track Record', weight: 0.10 },
    },
    createdAt: now(),
    updatedAt: now(),
  },
];

// ═══════════════════════════════════════════════════════════════
// CANDIDATES (for Senior GPU Architect role)
// ═══════════════════════════════════════════════════════════════

const candidates = [
  {
    id: 'cand-lisa-park',
    orgId: ORG_ID,
    hiringProcessId: 'hp-gpu-architect',
    firstName: 'Lisa',
    lastName: 'Park',
    email: 'lisa.park@example.com',
    phone: '+1-408-555-0101',
    currentCompany: 'AMD',
    currentTitle: 'Fellow — GPU Architecture',
    yearsExperience: 15,
    education: { degree: 'PhD', field: 'Electrical Engineering', institution: 'Stanford University', year: 2011 },
    location: 'San Jose, CA',
    status: 'final-round',
    source: 'Executive Search (Spencer Stuart)',
    resumeUrl: '/documents/cand-lisa-park/resume.pdf',
    summary: 'Led RDNA 4 architecture definition at AMD. 8 patents in GPU compute. Built and managed 60-person architecture team. Deep expertise in chiplet-based GPU design.',
    skills: ['GPU Microarchitecture', 'Chiplet Design', 'RDNA/CDNA', 'HBM Integration', 'RTL Design', 'Performance Modeling'],
    flags: [],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'cand-james-chen',
    orgId: ORG_ID,
    hiringProcessId: 'hp-gpu-architect',
    firstName: 'James',
    lastName: 'Chen',
    email: 'james.chen@example.com',
    phone: '+1-408-555-0102',
    currentCompany: 'Apple',
    currentTitle: 'Senior Director — Apple Silicon GPU',
    yearsExperience: 12,
    education: { degree: 'PhD', field: 'Computer Science', institution: 'MIT', year: 2014 },
    location: 'Cupertino, CA',
    status: 'final-round',
    source: 'Recruiter Outreach',
    resumeUrl: '/documents/cand-james-chen/resume.pdf',
    summary: 'Led Apple M3/M4 GPU core design. Pioneered unified memory architecture for Apple Silicon. Known for exceptional cross-functional leadership. 12 patents.',
    skills: ['GPU Core Design', 'Unified Memory Architecture', 'Power Optimization', 'SoC Integration', 'Metal Shader Architecture', 'Team Leadership'],
    flags: [],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'cand-priya-sharma',
    orgId: ORG_ID,
    hiringProcessId: 'hp-gpu-architect',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@nvidia.com',
    phone: '+1-408-555-0103',
    currentCompany: 'NVIDIA',
    currentTitle: 'Senior Architect — GPU Architecture',
    yearsExperience: 8,
    education: { degree: 'PhD', field: 'Computer Engineering', institution: 'UC Berkeley', year: 2018 },
    location: 'Santa Clara, CA',
    status: 'final-round',
    source: 'Internal Transfer',
    resumeUrl: '/documents/cand-priya-sharma/resume.pdf',
    summary: 'Led the Hopper (H100) SM architecture team. Key contributor to Blackwell design. Deep NVIDIA institutional knowledge. Fastest promotion track in GPU engineering in last 5 years.',
    skills: ['CUDA Architecture', 'SM Design', 'Tensor Core', 'NVLink', 'Performance Analysis', 'NVIDIA Internal Tools'],
    flags: [],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'cand-marcus-williams',
    orgId: ORG_ID,
    hiringProcessId: 'hp-gpu-architect',
    firstName: 'Marcus',
    lastName: 'Williams',
    email: 'marcus.williams@example.com',
    phone: '+1-503-555-0104',
    currentCompany: 'Intel',
    currentTitle: 'Principal Engineer — Xe GPU',
    yearsExperience: 18,
    education: { degree: 'PhD', field: 'Electrical Engineering', institution: 'UC Berkeley', year: 2008 },
    location: 'Hillsboro, OR',
    status: 'final-round',
    source: 'Executive Search (Heidrick & Struggles)',
    resumeUrl: '/documents/cand-marcus-williams/resume.pdf',
    summary: 'Longest tenure in discrete GPU design across industry. Led Ponte Vecchio architecture at Intel. Exceptional individual contributor but multiple references flag challenges in collaborative team settings.',
    skills: ['GPU Architecture', 'Xe Architecture', 'High-Performance Computing', 'FPGA Design', 'Silicon Validation', 'Performance Optimization'],
    flags: ['rebel-producer-alert'],
    createdAt: now(),
    updatedAt: now(),
  },
];

// ═══════════════════════════════════════════════════════════════
// INTERVIEWS
// ═══════════════════════════════════════════════════════════════

const interviews = [
  // ── Lisa Park Interviews ──────────────────────────────────
  {
    id: 'int-lisa-technical',
    orgId: ORG_ID,
    candidateId: 'cand-lisa-park',
    hiringProcessId: 'hp-gpu-architect',
    type: 'technical',
    stage: 'final-round',
    interviewer: { name: 'Dr. Ronny Kim', title: 'VP of GPU Architecture', email: 'rkim@nvidia.com' },
    scheduledDate: '2026-03-15T10:00:00Z',
    duration: 90,
    status: 'completed',
    format: 'in-person',
    location: 'NVIDIA HQ — Endeavor Building',
    notes: 'Deep dive on chiplet GPU architecture. Lisa presented her RDNA 4 compute unit innovations. Very strong on memory hierarchy. Some gaps in NVLink-specific knowledge.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'int-lisa-leadership',
    orgId: ORG_ID,
    candidateId: 'cand-lisa-park',
    hiringProcessId: 'hp-gpu-architect',
    type: 'leadership',
    stage: 'final-round',
    interviewer: { name: 'Sarah Lin', title: 'SVP of Hardware Engineering', email: 'slin@nvidia.com' },
    scheduledDate: '2026-03-15T14:00:00Z',
    duration: 60,
    status: 'completed',
    format: 'in-person',
    location: 'NVIDIA HQ — Endeavor Building',
    notes: 'Strong leadership examples from AMD. Managed through RDNA team restructuring. Concern: her leadership style is more directive — NVIDIA prefers collaborative autonomy.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'int-lisa-culture',
    orgId: ORG_ID,
    candidateId: 'cand-lisa-park',
    hiringProcessId: 'hp-gpu-architect',
    type: 'culture',
    stage: 'final-round',
    interviewer: { name: 'David Patel', title: 'Chief People Officer', email: 'dpatel@nvidia.com' },
    scheduledDate: '2026-03-16T10:00:00Z',
    duration: 45,
    status: 'completed',
    format: 'in-person',
    location: 'NVIDIA HQ — Endeavor Building',
    notes: 'Lisa is competitive and results-driven. Good alignment with NVIDIA speed. Some concern about adapting to NVIDIA open debate culture — AMD operates with more siloed decision-making.',
    createdAt: now(),
    updatedAt: now(),
  },

  // ── James Chen Interviews ────────────────────────────────
  {
    id: 'int-james-technical',
    orgId: ORG_ID,
    candidateId: 'cand-james-chen',
    hiringProcessId: 'hp-gpu-architect',
    type: 'technical',
    stage: 'final-round',
    interviewer: { name: 'Dr. Ronny Kim', title: 'VP of GPU Architecture', email: 'rkim@nvidia.com' },
    scheduledDate: '2026-03-18T10:00:00Z',
    duration: 90,
    status: 'completed',
    format: 'in-person',
    location: 'NVIDIA HQ — Endeavor Building',
    notes: 'Impressive unified memory architecture work. Strong on power optimization. Less experience with HPC/AI workloads at scale — Apple GPUs are mobile-first. Needs ramp on data center thermal/power.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'int-james-leadership',
    orgId: ORG_ID,
    candidateId: 'cand-james-chen',
    hiringProcessId: 'hp-gpu-architect',
    type: 'leadership',
    stage: 'final-round',
    interviewer: { name: 'Sarah Lin', title: 'SVP of Hardware Engineering', email: 'slin@nvidia.com' },
    scheduledDate: '2026-03-18T14:00:00Z',
    duration: 60,
    status: 'completed',
    format: 'in-person',
    location: 'NVIDIA HQ — Endeavor Building',
    notes: 'Excellent leadership presence. Built Apple GPU team from 20 to 80 people. Very strong on mentoring and team development. Collaborative style aligns well with NVIDIA culture.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'int-james-culture',
    orgId: ORG_ID,
    candidateId: 'cand-james-chen',
    hiringProcessId: 'hp-gpu-architect',
    type: 'culture',
    stage: 'final-round',
    interviewer: { name: 'David Patel', title: 'Chief People Officer', email: 'dpatel@nvidia.com' },
    scheduledDate: '2026-03-19T10:00:00Z',
    duration: 45,
    status: 'completed',
    format: 'in-person',
    location: 'NVIDIA HQ — Endeavor Building',
    notes: 'Well-rounded and personable. Risk: Apple culture of extreme secrecy may clash with NVIDIA open collaboration. James acknowledged this and expressed desire for more open environment.',
    createdAt: now(),
    updatedAt: now(),
  },

  // ── Priya Sharma Interviews ──────────────────────────────
  {
    id: 'int-priya-technical',
    orgId: ORG_ID,
    candidateId: 'cand-priya-sharma',
    hiringProcessId: 'hp-gpu-architect',
    type: 'technical',
    stage: 'final-round',
    interviewer: { name: 'Dr. Ronny Kim', title: 'VP of GPU Architecture', email: 'rkim@nvidia.com' },
    scheduledDate: '2026-03-20T10:00:00Z',
    duration: 90,
    status: 'completed',
    format: 'in-person',
    location: 'NVIDIA HQ — Endeavor Building',
    notes: 'Exceptional technical depth. Knows NVIDIA architecture inside and out. Presented novel SM scheduling approach that could yield 15% compute throughput improvement. Best technical interview of all candidates.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'int-priya-leadership',
    orgId: ORG_ID,
    candidateId: 'cand-priya-sharma',
    hiringProcessId: 'hp-gpu-architect',
    type: 'leadership',
    stage: 'final-round',
    interviewer: { name: 'Sarah Lin', title: 'SVP of Hardware Engineering', email: 'slin@nvidia.com' },
    scheduledDate: '2026-03-20T14:00:00Z',
    duration: 60,
    status: 'completed',
    format: 'in-person',
    location: 'NVIDIA HQ — Endeavor Building',
    notes: 'Strong technical leadership but team is relatively small (15 people). Untested managing 50+ person org. High potential but leadership at scale is a gap. Very self-aware about this.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'int-priya-culture',
    orgId: ORG_ID,
    candidateId: 'cand-priya-sharma',
    hiringProcessId: 'hp-gpu-architect',
    type: 'culture',
    stage: 'final-round',
    interviewer: { name: 'David Patel', title: 'Chief People Officer', email: 'dpatel@nvidia.com' },
    scheduledDate: '2026-03-21T10:00:00Z',
    duration: 45,
    status: 'completed',
    format: 'in-person',
    location: 'NVIDIA HQ — Endeavor Building',
    notes: 'Perfect culture fit. Lives and breathes NVIDIA values. Respected across engineering. Internal champion. Promotion would be a strong retention and culture signal.',
    createdAt: now(),
    updatedAt: now(),
  },

  // ── Marcus Williams Interviews ───────────────────────────
  {
    id: 'int-marcus-technical',
    orgId: ORG_ID,
    candidateId: 'cand-marcus-williams',
    hiringProcessId: 'hp-gpu-architect',
    type: 'technical',
    stage: 'final-round',
    interviewer: { name: 'Dr. Ronny Kim', title: 'VP of GPU Architecture', email: 'rkim@nvidia.com' },
    scheduledDate: '2026-03-22T10:00:00Z',
    duration: 90,
    status: 'completed',
    format: 'in-person',
    location: 'NVIDIA HQ — Endeavor Building',
    notes: 'Strong foundational knowledge across decades of GPU design. Very deep on validation and verification. Less current on latest AI-specific optimizations. Ponte Vecchio experience is relevant but that program struggled.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'int-marcus-leadership',
    orgId: ORG_ID,
    candidateId: 'cand-marcus-williams',
    hiringProcessId: 'hp-gpu-architect',
    type: 'leadership',
    stage: 'final-round',
    interviewer: { name: 'Sarah Lin', title: 'SVP of Hardware Engineering', email: 'slin@nvidia.com' },
    scheduledDate: '2026-03-22T14:00:00Z',
    duration: 60,
    status: 'completed',
    format: 'in-person',
    location: 'NVIDIA HQ — Endeavor Building',
    notes: 'Marcus prefers to work independently. Struggled to articulate team leadership philosophy. Examples were mostly about personal technical contributions. Admitted he "finds teams slow things down." Red flag for senior role.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'int-marcus-culture',
    orgId: ORG_ID,
    candidateId: 'cand-marcus-williams',
    hiringProcessId: 'hp-gpu-architect',
    type: 'culture',
    stage: 'final-round',
    interviewer: { name: 'David Patel', title: 'Chief People Officer', email: 'dpatel@nvidia.com' },
    scheduledDate: '2026-03-23T10:00:00Z',
    duration: 45,
    status: 'completed',
    format: 'in-person',
    location: 'NVIDIA HQ — Endeavor Building',
    notes: 'Significant culture concerns. Marcus is highly opinionated and dismissive of collaborative processes. Multiple references from Intel confirm team friction. Brilliant but divisive. Classic rebel producer profile.',
    createdAt: now(),
    updatedAt: now(),
  },
];

// ═══════════════════════════════════════════════════════════════
// SCORES (Interview + M13 Vector Scores)
// ═══════════════════════════════════════════════════════════════

const scores = [
  // ── Lisa Park Scores ──────────────────────────────────────
  {
    id: 'score-lisa-interview',
    orgId: ORG_ID,
    candidateId: 'cand-lisa-park',
    hiringProcessId: 'hp-gpu-architect',
    type: 'interview',
    scores: {
      technical: { value: 4.8, max: 5, interviewer: 'Dr. Ronny Kim' },
      leadership: { value: 4.2, max: 5, interviewer: 'Sarah Lin' },
      culture: { value: 3.8, max: 5, interviewer: 'David Patel' },
    },
    overallScore: 4.27,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'score-lisa-m13',
    orgId: ORG_ID,
    candidateId: 'cand-lisa-park',
    hiringProcessId: 'hp-gpu-architect',
    type: 'm13-vectors',
    scores: {
      strategicThinking: { value: 5, max: 5, label: 'Strategic Thinking' },
      decisionMaking: { value: 4, max: 5, label: 'Decision Making' },
      innovation: { value: 5, max: 5, label: 'Innovation' },
      resultsOrientation: { value: 5, max: 5, label: 'Results Orientation' },
      teamBuilding: { value: 3, max: 5, label: 'Team Building' },
      communication: { value: 4, max: 5, label: 'Communication' },
      adaptability: { value: 3, max: 5, label: 'Adaptability' },
      integrity: { value: 5, max: 5, label: 'Integrity' },
      customerFocus: { value: 4, max: 5, label: 'Customer Focus' },
      technicalExcellence: { value: 5, max: 5, label: 'Technical Excellence' },
      collaboration: { value: 3, max: 5, label: 'Collaboration' },
      accountability: { value: 5, max: 5, label: 'Accountability' },
      vision: { value: 4, max: 5, label: 'Vision' },
    },
    overallScore: 4.23,
    createdAt: now(),
    updatedAt: now(),
  },

  // ── James Chen Scores ────────────────────────────────────
  {
    id: 'score-james-interview',
    orgId: ORG_ID,
    candidateId: 'cand-james-chen',
    hiringProcessId: 'hp-gpu-architect',
    type: 'interview',
    scores: {
      technical: { value: 4.5, max: 5, interviewer: 'Dr. Ronny Kim' },
      leadership: { value: 4.5, max: 5, interviewer: 'Sarah Lin' },
      culture: { value: 4.2, max: 5, interviewer: 'David Patel' },
    },
    overallScore: 4.40,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'score-james-m13',
    orgId: ORG_ID,
    candidateId: 'cand-james-chen',
    hiringProcessId: 'hp-gpu-architect',
    type: 'm13-vectors',
    scores: {
      strategicThinking: { value: 4, max: 5, label: 'Strategic Thinking' },
      decisionMaking: { value: 4, max: 5, label: 'Decision Making' },
      innovation: { value: 4, max: 5, label: 'Innovation' },
      resultsOrientation: { value: 4, max: 5, label: 'Results Orientation' },
      teamBuilding: { value: 5, max: 5, label: 'Team Building' },
      communication: { value: 4, max: 5, label: 'Communication' },
      adaptability: { value: 4, max: 5, label: 'Adaptability' },
      integrity: { value: 5, max: 5, label: 'Integrity' },
      customerFocus: { value: 4, max: 5, label: 'Customer Focus' },
      technicalExcellence: { value: 4, max: 5, label: 'Technical Excellence' },
      collaboration: { value: 5, max: 5, label: 'Collaboration' },
      accountability: { value: 4, max: 5, label: 'Accountability' },
      vision: { value: 4, max: 5, label: 'Vision' },
    },
    overallScore: 4.23,
    createdAt: now(),
    updatedAt: now(),
  },

  // ── Priya Sharma Scores ──────────────────────────────────
  {
    id: 'score-priya-interview',
    orgId: ORG_ID,
    candidateId: 'cand-priya-sharma',
    hiringProcessId: 'hp-gpu-architect',
    type: 'interview',
    scores: {
      technical: { value: 5.0, max: 5, interviewer: 'Dr. Ronny Kim' },
      leadership: { value: 4.0, max: 5, interviewer: 'Sarah Lin' },
      culture: { value: 5.0, max: 5, interviewer: 'David Patel' },
    },
    overallScore: 4.67,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'score-priya-m13',
    orgId: ORG_ID,
    candidateId: 'cand-priya-sharma',
    hiringProcessId: 'hp-gpu-architect',
    type: 'm13-vectors',
    scores: {
      strategicThinking: { value: 4, max: 5, label: 'Strategic Thinking' },
      decisionMaking: { value: 4, max: 5, label: 'Decision Making' },
      innovation: { value: 5, max: 5, label: 'Innovation' },
      resultsOrientation: { value: 5, max: 5, label: 'Results Orientation' },
      teamBuilding: { value: 4, max: 5, label: 'Team Building' },
      communication: { value: 4, max: 5, label: 'Communication' },
      adaptability: { value: 5, max: 5, label: 'Adaptability' },
      integrity: { value: 5, max: 5, label: 'Integrity' },
      customerFocus: { value: 4, max: 5, label: 'Customer Focus' },
      technicalExcellence: { value: 5, max: 5, label: 'Technical Excellence' },
      collaboration: { value: 5, max: 5, label: 'Collaboration' },
      accountability: { value: 5, max: 5, label: 'Accountability' },
      vision: { value: 4, max: 5, label: 'Vision' },
    },
    overallScore: 4.54,
    createdAt: now(),
    updatedAt: now(),
  },

  // ── Marcus Williams Scores ───────────────────────────────
  {
    id: 'score-marcus-interview',
    orgId: ORG_ID,
    candidateId: 'cand-marcus-williams',
    hiringProcessId: 'hp-gpu-architect',
    type: 'interview',
    scores: {
      technical: { value: 4.2, max: 5, interviewer: 'Dr. Ronny Kim' },
      leadership: { value: 3.5, max: 5, interviewer: 'Sarah Lin' },
      culture: { value: 3.0, max: 5, interviewer: 'David Patel' },
    },
    overallScore: 3.57,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'score-marcus-m13',
    orgId: ORG_ID,
    candidateId: 'cand-marcus-williams',
    hiringProcessId: 'hp-gpu-architect',
    type: 'm13-vectors',
    scores: {
      strategicThinking: { value: 4, max: 5, label: 'Strategic Thinking' },
      decisionMaking: { value: 3, max: 5, label: 'Decision Making' },
      innovation: { value: 4, max: 5, label: 'Innovation' },
      resultsOrientation: { value: 5, max: 5, label: 'Results Orientation' },
      teamBuilding: { value: 2, max: 5, label: 'Team Building' },
      communication: { value: 3, max: 5, label: 'Communication' },
      adaptability: { value: 2, max: 5, label: 'Adaptability' },
      integrity: { value: 4, max: 5, label: 'Integrity' },
      customerFocus: { value: 3, max: 5, label: 'Customer Focus' },
      technicalExcellence: { value: 5, max: 5, label: 'Technical Excellence' },
      collaboration: { value: 2, max: 5, label: 'Collaboration' },
      accountability: { value: 4, max: 5, label: 'Accountability' },
      vision: { value: 3, max: 5, label: 'Vision' },
    },
    overallScore: 3.38,
    rebelProducerAlert: {
      triggered: true,
      reason: 'High V6 Performance (4.8) combined with Low V2 Culture (3.0)',
      v6Performance: 4.8,
      v2Culture: 3.0,
      recommendation: 'Proceed with caution. Consider IC track instead of people-leadership role.',
    },
    createdAt: now(),
    updatedAt: now(),
  },
];

// ═══════════════════════════════════════════════════════════════
// AI ANALYSES
// ═══════════════════════════════════════════════════════════════

const aiAnalyses = [
  {
    id: 'ai-lisa-park',
    orgId: ORG_ID,
    candidateId: 'cand-lisa-park',
    hiringProcessId: 'hp-gpu-architect',
    type: 'candidate-assessment',
    model: 'claude-opus-4-6',
    insight: 'Strong technical candidate with proven GPU architecture leadership at AMD. Primary concern is culture adjustment — AMD operates with more hierarchical decision-making than NVIDIA\'s flat, debate-driven culture. Lisa\'s directive leadership style may create friction with NVIDIA\'s senior ICs who expect autonomy. Recommend structured onboarding with culture coaching if hired.',
    strengths: [
      'Deepest competitive GPU architecture knowledge (RDNA 4)',
      'Proven ability to ship commercial silicon at scale',
      'Strong strategic thinking — can define multi-year architecture roadmaps',
      'Patent portfolio demonstrates genuine innovation',
    ],
    concerns: [
      'AMD cultural norms may clash with NVIDIA open-debate style',
      'Directive leadership style vs. NVIDIA collaborative autonomy',
      'Limited NVLink/interconnect experience (AMD uses Infinity Fabric)',
      'Non-compete and IP boundaries from AMD need legal review',
    ],
    recommendation: 'STRONG HIRE with culture onboarding plan',
    confidenceScore: 0.82,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'ai-james-chen',
    orgId: ORG_ID,
    candidateId: 'cand-james-chen',
    hiringProcessId: 'hp-gpu-architect',
    type: 'candidate-assessment',
    model: 'claude-opus-4-6',
    insight: 'Well-rounded candidate with excellent leadership scores and strong technical foundation from Apple Silicon. Primary gap is data center GPU experience — Apple GPUs are mobile/desktop focused with very different power, thermal, and scale constraints. Transition from Apple\'s extreme secrecy culture to NVIDIA\'s openness is a risk factor, though James explicitly expressed desire for this change.',
    strengths: [
      'Exceptional team builder — grew Apple GPU team 4x',
      'Unified memory architecture innovation is directly relevant',
      'Strong cross-functional leadership with Silicon, Software, and Product teams',
      'Best overall interview scores across all dimensions',
    ],
    concerns: [
      'No data center GPU experience — all work is mobile/desktop scale',
      'Apple culture of secrecy may be deeply ingrained despite stated openness',
      'Will need significant ramp time on HPC/AI workload patterns',
      'Compensation expectations may be very high coming from Apple equity',
    ],
    recommendation: 'HIRE — best balanced candidate, needs DC ramp plan',
    confidenceScore: 0.78,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'ai-priya-sharma',
    orgId: ORG_ID,
    candidateId: 'cand-priya-sharma',
    hiringProcessId: 'hp-gpu-architect',
    type: 'candidate-assessment',
    model: 'claude-opus-4-6',
    insight: 'Strongest technical candidate with deep institutional knowledge from leading Hopper architecture. Perfect culture fit as an internal promotion. The main concern is untested leadership at the scale required — she has led 15 people, this role needs 50+. However, her self-awareness of this gap and strong internal reputation make her a high-upside bet. Promoting her also sends a powerful retention signal to the broader engineering team.',
    strengths: [
      'Best technical scores of any candidate — deep NVIDIA architecture knowledge',
      'Led the most successful GPU architecture (Hopper/H100) in recent history',
      'Perfect culture alignment — embodiment of NVIDIA engineering values',
      'Internal promotion sends strong talent retention signal',
    ],
    concerns: [
      'Untested leading 50+ person organization',
      'Only 8 years experience vs. 12-18 for external candidates',
      'May be perceived as "too junior" for the title by external stakeholders',
      'Needs executive presence development for customer/partner-facing situations',
    ],
    recommendation: 'STRONG HIRE — highest upside, pair with executive coach',
    confidenceScore: 0.88,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'ai-marcus-williams',
    orgId: ORG_ID,
    candidateId: 'cand-marcus-williams',
    hiringProcessId: 'hp-gpu-architect',
    type: 'candidate-assessment',
    model: 'claude-opus-4-6',
    insight: 'Exceptional individual contributor with the longest GPU design tenure across industry. However, multiple data points indicate significant team collaboration issues. References from Intel confirm pattern of alienating colleagues and preferring solo decision-making. Classic "rebel producer" profile: extremely high individual output but corrosive to team dynamics. At NVIDIA\'s scale and culture, this is a disqualifying combination for a senior leadership role.',
    strengths: [
      'Deepest individual experience in GPU architecture (18 years)',
      'Strong on silicon validation and verification — important for reliability',
      'Ponte Vecchio experience provides competitor intelligence value',
      'Technical publications and patents are impressive',
    ],
    concerns: [
      'REBEL PRODUCER ALERT: High V6 Performance (4.8) + Low V2 Culture (3.0)',
      'Multiple references flag team friction and dismissive behavior',
      'Intel Ponte Vecchio program he led was widely considered troubled',
      'Stated "teams slow things down" in leadership interview — antithetical to NVIDIA culture',
      'Culture score of 3.0/5 is lowest of all candidates by significant margin',
    ],
    recommendation: 'DO NOT HIRE for leadership role. Consider senior IC/Fellow track if interested.',
    confidenceScore: 0.91,
    createdAt: now(),
    updatedAt: now(),
  },
];

// ═══════════════════════════════════════════════════════════════
// REFERENCES
// ═══════════════════════════════════════════════════════════════

const references = [
  // ── Lisa Park References ──────────────────────────────────
  {
    id: 'ref-lisa-1',
    orgId: ORG_ID,
    candidateId: 'cand-lisa-park',
    hiringProcessId: 'hp-gpu-architect',
    referenceName: 'Dr. Michael Torres',
    referenceTitle: 'SVP Engineering, AMD',
    relationship: 'Direct Manager',
    yearsKnown: 8,
    contactDate: '2026-03-25',
    status: 'completed',
    scores: {
      technicalAbility: { value: 5, max: 5 },
      leadership: { value: 4, max: 5 },
      collaboration: { value: 3, max: 5 },
      reliability: { value: 5, max: 5 },
      overallRecommendation: { value: 4, max: 5 },
    },
    comments: 'Lisa is one of the strongest GPU architects I have worked with. She drives results relentlessly. The one area for development is her tendency to make decisions without full team buy-in — she is right most of the time, but it can create resentment.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'ref-lisa-2',
    orgId: ORG_ID,
    candidateId: 'cand-lisa-park',
    hiringProcessId: 'hp-gpu-architect',
    referenceName: 'Dr. Emily Zhang',
    referenceTitle: 'Principal Architect, AMD',
    relationship: 'Peer',
    yearsKnown: 6,
    contactDate: '2026-03-26',
    status: 'completed',
    scores: {
      technicalAbility: { value: 5, max: 5 },
      leadership: { value: 4, max: 5 },
      collaboration: { value: 4, max: 5 },
      reliability: { value: 5, max: 5 },
      overallRecommendation: { value: 4, max: 5 },
    },
    comments: 'Brilliant architect. I learned a lot working alongside her. She expects the same intensity from everyone, which not everyone can handle. But she is fair and gives credit where due.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'ref-lisa-3',
    orgId: ORG_ID,
    candidateId: 'cand-lisa-park',
    hiringProcessId: 'hp-gpu-architect',
    referenceName: 'Robert Kim',
    referenceTitle: 'VP Product Management, AMD',
    relationship: 'Cross-functional partner',
    yearsKnown: 5,
    contactDate: '2026-03-27',
    status: 'completed',
    scores: {
      technicalAbility: { value: 5, max: 5 },
      leadership: { value: 4, max: 5 },
      collaboration: { value: 3, max: 5 },
      reliability: { value: 5, max: 5 },
      overallRecommendation: { value: 4, max: 5 },
    },
    comments: 'Lisa sometimes steamrolls product requirements in favor of what she thinks is the right architecture. Technically she is usually right, but the process matters. She would benefit from a culture that forces more debate.',
    createdAt: now(),
    updatedAt: now(),
  },

  // ── James Chen References ────────────────────────────────
  {
    id: 'ref-james-1',
    orgId: ORG_ID,
    candidateId: 'cand-james-chen',
    hiringProcessId: 'hp-gpu-architect',
    referenceName: 'Katherine Wu',
    referenceTitle: 'VP Silicon Engineering, Apple',
    relationship: 'Direct Manager',
    yearsKnown: 7,
    contactDate: '2026-03-25',
    status: 'completed',
    scores: {
      technicalAbility: { value: 5, max: 5 },
      leadership: { value: 5, max: 5 },
      collaboration: { value: 5, max: 5 },
      reliability: { value: 4, max: 5 },
      overallRecommendation: { value: 5, max: 5 },
    },
    comments: 'James is one of the best engineering leaders I have managed. He builds exceptional teams and is deeply respected by his reports. We will miss him tremendously. His only gap is that he sometimes over-indexes on consensus, which can slow decisions.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'ref-james-2',
    orgId: ORG_ID,
    candidateId: 'cand-james-chen',
    hiringProcessId: 'hp-gpu-architect',
    referenceName: 'Dr. Alex Rivera',
    referenceTitle: 'Senior Director, Apple Silicon',
    relationship: 'Peer',
    yearsKnown: 5,
    contactDate: '2026-03-26',
    status: 'completed',
    scores: {
      technicalAbility: { value: 4, max: 5 },
      leadership: { value: 5, max: 5 },
      collaboration: { value: 5, max: 5 },
      reliability: { value: 5, max: 5 },
      overallRecommendation: { value: 5, max: 5 },
    },
    comments: 'James is the kind of leader who makes everyone around him better. Technically very strong, but his real superpower is how he develops people. Three of his reports have been promoted to director level.',
    createdAt: now(),
    updatedAt: now(),
  },

  // ── Priya Sharma References ──────────────────────────────
  {
    id: 'ref-priya-1',
    orgId: ORG_ID,
    candidateId: 'cand-priya-sharma',
    hiringProcessId: 'hp-gpu-architect',
    referenceName: 'Dr. Ronny Kim',
    referenceTitle: 'VP of GPU Architecture, NVIDIA',
    relationship: 'Skip-level Manager',
    yearsKnown: 8,
    contactDate: '2026-03-25',
    status: 'completed',
    scores: {
      technicalAbility: { value: 5, max: 5 },
      leadership: { value: 4, max: 5 },
      collaboration: { value: 5, max: 5 },
      reliability: { value: 5, max: 5 },
      overallRecommendation: { value: 5, max: 5 },
    },
    comments: 'Priya is the best architect to come through NVIDIA in the last decade. She led the Hopper SM architecture work that is now the foundation of our AI dominance. My only concern is that she has not managed a large org yet, but I believe she is ready.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'ref-priya-2',
    orgId: ORG_ID,
    candidateId: 'cand-priya-sharma',
    hiringProcessId: 'hp-gpu-architect',
    referenceName: 'Amit Patel',
    referenceTitle: 'Senior Architect, NVIDIA',
    relationship: 'Peer',
    yearsKnown: 6,
    contactDate: '2026-03-26',
    status: 'completed',
    scores: {
      technicalAbility: { value: 5, max: 5 },
      leadership: { value: 4, max: 5 },
      collaboration: { value: 5, max: 5 },
      reliability: { value: 5, max: 5 },
      overallRecommendation: { value: 5, max: 5 },
    },
    comments: 'Priya is the person everyone goes to when they are stuck on a hard problem. She is generous with her time and knowledge. She deserves this promotion more than anyone.',
    createdAt: now(),
    updatedAt: now(),
  },

  // ── Marcus Williams References ───────────────────────────
  {
    id: 'ref-marcus-1',
    orgId: ORG_ID,
    candidateId: 'cand-marcus-williams',
    hiringProcessId: 'hp-gpu-architect',
    referenceName: 'Thomas Anderson',
    referenceTitle: 'VP of GPU Engineering, Intel',
    relationship: 'Direct Manager',
    yearsKnown: 10,
    contactDate: '2026-03-25',
    status: 'completed',
    scores: {
      technicalAbility: { value: 5, max: 5 },
      leadership: { value: 3, max: 5 },
      collaboration: { value: 2, max: 5 },
      reliability: { value: 4, max: 5 },
      overallRecommendation: { value: 3, max: 5 },
    },
    comments: 'Marcus is technically exceptional. But I have to be honest — he is very difficult to work with. He believes he is the smartest person in the room and lets everyone know it. We lost two senior architects who refused to work with him. I would recommend him for an individual contributor role only.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'ref-marcus-2',
    orgId: ORG_ID,
    candidateId: 'cand-marcus-williams',
    hiringProcessId: 'hp-gpu-architect',
    referenceName: 'Dr. Sarah Chang',
    referenceTitle: 'Principal Engineer, Intel',
    relationship: 'Peer',
    yearsKnown: 8,
    contactDate: '2026-03-26',
    status: 'completed',
    scores: {
      technicalAbility: { value: 5, max: 5 },
      leadership: { value: 2, max: 5 },
      collaboration: { value: 2, max: 5 },
      reliability: { value: 4, max: 5 },
      overallRecommendation: { value: 2, max: 5 },
    },
    comments: 'I have immense respect for Marcus\'s technical ability, but I cannot recommend him for a leadership position. He undermines other engineers in reviews, takes credit for team work, and creates a hostile environment for junior staff. Three people on our team transferred out because of him.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'ref-marcus-3',
    orgId: ORG_ID,
    candidateId: 'cand-marcus-williams',
    hiringProcessId: 'hp-gpu-architect',
    referenceName: 'Jennifer Lopez',
    referenceTitle: 'HR Business Partner, Intel GPU Division',
    relationship: 'HR Partner',
    yearsKnown: 6,
    contactDate: '2026-03-27',
    status: 'completed',
    scores: {
      technicalAbility: { value: 4, max: 5 },
      leadership: { value: 2, max: 5 },
      collaboration: { value: 2, max: 5 },
      reliability: { value: 3, max: 5 },
      overallRecommendation: { value: 2, max: 5 },
    },
    comments: 'Marcus has been the subject of multiple HR investigations related to hostile behavior toward colleagues. None rose to the level of formal action, but the pattern is clear. He produces exceptional technical work but at significant cost to team morale and retention.',
    createdAt: now(),
    updatedAt: now(),
  },
];

// ═══════════════════════════════════════════════════════════════
// SEED LOADER
// ═══════════════════════════════════════════════════════════════

/**
 * Load NVIDIA seed data into Cosmos DB containers.
 * Designed to be called from server startup when no existing data is present.
 *
 * @param {import('@azure/cosmos').Database} database - Cosmos DB database instance
 * @param {boolean} cosmosAvailable - Whether Cosmos is connected
 */
async function loadNvidiaSeedData(database, cosmosAvailable) {
  if (!cosmosAvailable || !database) {
    console.log('[Interview9 Seed] Cosmos not available — skipping seed data');
    return { loaded: false, reason: 'cosmos-unavailable' };
  }

  try {
    // Check if data already exists
    const hpContainer = database.container('hiringProcesses');
    const { resources: existing } = await hpContainer.items
      .query({ query: 'SELECT TOP 1 * FROM c WHERE c.orgId = @orgId', parameters: [{ name: '@orgId', value: ORG_ID }] })
      .fetchAll();

    if (existing.length > 0) {
      console.log('[Interview9 Seed] NVIDIA seed data already loaded — skipping');
      return { loaded: false, reason: 'data-exists' };
    }

    console.log('[Interview9 Seed] Loading NVIDIA seed data...');

    // Load hiring processes
    for (const hp of hiringProcesses) {
      await hpContainer.items.create(hp);
    }
    console.log(`[Interview9 Seed] Loaded ${hiringProcesses.length} hiring processes`);

    // Load candidates
    const candContainer = database.container('candidates');
    for (const cand of candidates) {
      await candContainer.items.create(cand);
    }
    console.log(`[Interview9 Seed] Loaded ${candidates.length} candidates`);

    // Load interviews
    const intContainer = database.container('interviews');
    for (const int of interviews) {
      await intContainer.items.create(int);
    }
    console.log(`[Interview9 Seed] Loaded ${interviews.length} interviews`);

    // Load scores
    const scoreContainer = database.container('scores');
    for (const score of scores) {
      await scoreContainer.items.create(score);
    }
    console.log(`[Interview9 Seed] Loaded ${scores.length} scores`);

    // Load references
    const refContainer = database.container('references');
    for (const ref of references) {
      await refContainer.items.create(ref);
    }
    console.log(`[Interview9 Seed] Loaded ${references.length} references`);

    // Load AI analyses
    const aiContainer = database.container('aiAnalyses');
    for (const analysis of aiAnalyses) {
      await aiContainer.items.create(analysis);
    }
    console.log(`[Interview9 Seed] Loaded ${aiAnalyses.length} AI analyses`);

    const summary = {
      loaded: true,
      organizationId: ORG_ID,
      counts: {
        hiringProcesses: hiringProcesses.length,
        candidates: candidates.length,
        interviews: interviews.length,
        scores: scores.length,
        references: references.length,
        aiAnalyses: aiAnalyses.length,
      },
    };

    console.log('[Interview9 Seed] NVIDIA seed data loaded successfully', summary);
    return summary;
  } catch (error) {
    console.error('[Interview9 Seed] Failed to load NVIDIA seed data:', error);
    return { loaded: false, reason: 'error', error: error.message };
  }
}

module.exports = {
  loadNvidiaSeedData,
  ORG_ID,
  hiringProcesses,
  candidates,
  interviews,
  scores,
  aiAnalyses,
  references,
};
