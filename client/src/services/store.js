import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Candidates
  candidates: [
    {
      id: 'C001',
      name: 'Sarah Chen',
      role: 'VP of Engineering',
      roleLevel: 'senior',
      status: 'interviewing',
      stage: 'Technical',
      appliedDate: '2026-01-15',
      scores: { overall: 4.2, culture: 4.5, technical: 4.0, leadership: 4.1 },
      interviewCount: 2,
      nextInterview: '2026-02-10',
    },
    {
      id: 'C002',
      name: 'Marcus Johnson',
      role: 'Senior Sales Executive',
      roleLevel: 'sales',
      status: 'interviewing',
      stage: 'Final Round',
      appliedDate: '2026-01-20',
      scores: { overall: 3.8, culture: 3.5, technical: 3.9, leadership: 4.0 },
      interviewCount: 3,
      nextInterview: '2026-02-12',
    },
    {
      id: 'C003',
      name: 'Emily Rodriguez',
      role: 'Product Manager',
      roleLevel: 'mid',
      status: 'screening',
      stage: 'Phone Screen',
      appliedDate: '2026-01-28',
      scores: { overall: 0, culture: 0, technical: 0, leadership: 0 },
      interviewCount: 0,
      nextInterview: '2026-02-09',
    },
    {
      id: 'C004',
      name: 'David Kim',
      role: 'Chief Financial Officer',
      roleLevel: 'executive',
      status: 'offer',
      stage: 'Offer Extended',
      appliedDate: '2026-01-05',
      scores: { overall: 4.6, culture: 4.3, technical: 4.8, leadership: 4.7 },
      interviewCount: 5,
      nextInterview: null,
    },
    {
      id: 'C005',
      name: 'Lisa Thompson',
      role: 'Marketing Director',
      roleLevel: 'senior',
      status: 'rejected',
      stage: 'Closed',
      appliedDate: '2026-01-10',
      scores: { overall: 2.8, culture: 2.5, technical: 3.0, leadership: 2.9 },
      interviewCount: 2,
      nextInterview: null,
    },
    {
      id: 'C006',
      name: 'James Patel',
      role: 'Software Engineer',
      roleLevel: 'individual',
      status: 'interviewing',
      stage: 'Achievement-Anchored',
      appliedDate: '2026-02-01',
      scores: { overall: 3.5, culture: 4.0, technical: 3.2, leadership: 3.3 },
      interviewCount: 1,
      nextInterview: '2026-02-11',
    },
  ],
  addCandidate: (candidate) =>
    set((state) => ({ candidates: [...state.candidates, { ...candidate, id: `C${String(state.candidates.length + 1).padStart(3, '0')}` }] })),
  updateCandidate: (id, updates) =>
    set((state) => ({
      candidates: state.candidates.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  // Interviews
  interviews: [
    {
      id: 'INT001',
      candidateId: 'C001',
      date: '2026-02-03',
      type: 'Achievement-Anchored',
      interviewer: 'Edwin Miller',
      status: 'completed',
      questionsUsed: ['Q006', 'Q007', 'Q008', 'Q010'],
      scores: { situation: 4, task: 4, action: 5, result: 4 },
      notes: 'Strong technical background with clear achievement examples. Quantified revenue impact effectively.',
      measurement13Scores: { 10: 4, 12: 4, 6: 5 },
    },
    {
      id: 'INT002',
      candidateId: 'C002',
      date: '2026-02-05',
      type: 'Sales Interview',
      interviewer: 'Edwin Miller',
      status: 'completed',
      questionsUsed: ['Q022', 'Q023', 'Q024'],
      scores: { situation: 4, task: 3, action: 4, result: 5 },
      notes: 'Excellent quota attainment history. Pipeline management methodology is systematic. Team selling answer was weaker — potential rebel producer flag.',
      measurement13Scores: { 10: 5, 5: 3, 11: 4 },
    },
  ],
  addInterview: (interview) =>
    set((state) => ({ interviews: [...state.interviews, { ...interview, id: `INT${String(state.interviews.length + 1).padStart(3, '0')}` }] })),

  // Interview Plans
  interviewPlans: [
    {
      id: 'PLN001',
      name: 'Senior Management Interview',
      roleLevel: 'senior',
      questions: ['Q006', 'Q010', 'Q017', 'Q027', 'Q028', 'Q029', 'Q030', 'Q031', 'Q032', 'Q035'],
      stages: ['Traditional', 'Achievement-Anchored', 'Senior Management', 'Pressure Cooker', 'Final Round'],
      estimatedDuration: 90,
    },
    {
      id: 'PLN002',
      name: 'Sales Professional Interview',
      roleLevel: 'sales',
      questions: ['Q001', 'Q006', 'Q009', 'Q022', 'Q023', 'Q024', 'Q030', 'Q031', 'Q034', 'Q035'],
      stages: ['Traditional', 'Achievement-Anchored', 'Sales Specific', 'Pressure Cooker', 'Final Round'],
      estimatedDuration: 75,
    },
  ],
  addInterviewPlan: (plan) =>
    set((state) => ({ interviewPlans: [...state.interviewPlans, { ...plan, id: `PLN${String(state.interviewPlans.length + 1).padStart(3, '0')}` }] })),

  // Reference Checks
  referenceChecks: [
    {
      id: 'REF001',
      candidateId: 'C001',
      referenceName: 'John Davis',
      referenceTitle: 'Former CTO',
      relationship: 'Direct Manager',
      status: 'completed',
      scores: { overall: 4, leadership: 4, technical: 5, culture: 4 },
      notes: 'Confirmed strong technical leadership. Described Sarah as a transformative hire.',
      validationGaps: [],
    },
    {
      id: 'REF002',
      candidateId: 'C004',
      referenceName: 'Patricia Williams',
      referenceTitle: 'Board Chair',
      relationship: 'Board Member',
      status: 'completed',
      scores: { overall: 5, leadership: 5, technical: 5, culture: 4 },
      notes: 'Exceptional financial acumen. Built three finance teams from scratch.',
      validationGaps: [],
    },
  ],
  addReferenceCheck: (ref) =>
    set((state) => ({ referenceChecks: [...state.referenceChecks, { ...ref, id: `REF${String(state.referenceChecks.length + 1).padStart(3, '0')}` }] })),

  // Hiring Processes (onboarding)
  hiringProcesses: [],
  addHiringProcess: (process) =>
    set((state) => ({
      hiringProcesses: [
        ...state.hiringProcesses,
        { ...process, id: `HP${String(state.hiringProcesses.length + 1).padStart(3, '0')}`, createdAt: new Date().toISOString() },
      ],
    })),
  updateHiringProcess: (id, updates) =>
    set((state) => ({
      hiringProcesses: state.hiringProcesses.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  // Document Room
  processDocuments: [],
  addProcessDocument: (doc) =>
    set((state) => ({
      processDocuments: [
        ...state.processDocuments,
        { ...doc, id: `DOC${String(state.processDocuments.length + 1).padStart(3, '0')}`, uploadedAt: new Date().toISOString() },
      ],
    })),

  // UI State
  selectedCandidate: null,
  setSelectedCandidate: (id) => set({ selectedCandidate: id }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));

export default useStore;
