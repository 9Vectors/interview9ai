import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Candidates — empty by default, populated from API
  candidates: [],
  addCandidate: (candidate) =>
    set((state) => ({ candidates: [...state.candidates, { ...candidate, id: `C${String(state.candidates.length + 1).padStart(3, '0')}` }] })),
  updateCandidate: (id, updates) =>
    set((state) => ({
      candidates: state.candidates.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  setCandidates: (candidates) => set({ candidates }),

  // Interviews — empty by default, populated from API
  interviews: [],
  addInterview: (interview) =>
    set((state) => ({ interviews: [...state.interviews, { ...interview, id: `INT${String(state.interviews.length + 1).padStart(3, '0')}` }] })),
  setInterviews: (interviews) => set({ interviews }),

  // Interview Plans — empty by default
  interviewPlans: [],
  addInterviewPlan: (plan) =>
    set((state) => ({ interviewPlans: [...state.interviewPlans, { ...plan, id: `PLN${String(state.interviewPlans.length + 1).padStart(3, '0')}` }] })),
  setInterviewPlans: (plans) => set({ interviewPlans: plans }),

  // Reference Checks — empty by default
  referenceChecks: [],
  addReferenceCheck: (ref) =>
    set((state) => ({ referenceChecks: [...state.referenceChecks, { ...ref, id: `REF${String(state.referenceChecks.length + 1).padStart(3, '0')}` }] })),
  setReferenceChecks: (refs) => set({ referenceChecks: refs }),

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
