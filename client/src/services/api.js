import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-Source-App'] = 'Interview9';
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = 'https://thegreymatter.ai/auth?redirect=interview9';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Candidates
export const getCandidates = (params) => api.get('/candidates', { params });
export const getCandidate = (id) => api.get(`/candidates/${id}`);
export const createCandidate = (data) => api.post('/candidates', data);
export const updateCandidate = (id, data) => api.put(`/candidates/${id}`, data);

// Interviews
export const getInterviews = (params) => api.get('/interviews', { params });
export const createInterview = (data) => api.post('/interviews', data);

// Interview Plans
export const getInterviewPlans = () => api.get('/interview-plans');
export const createInterviewPlan = (data) => api.post('/interview-plans', data);

// Reference Checks
export const getReferenceChecks = (candidateId) => api.get(`/candidates/${candidateId}/references`);
export const createReferenceCheck = (candidateId, data) => api.post(`/candidates/${candidateId}/references`, data);

// AI Endpoints
export const analyzeCandidate = (candidateId) => api.post(`/ai/analyze`, { candidateId });
export const generateInterviewGuide = (data) => api.post('/ai/generate', data);
export const getRecommendations = (candidateId) => api.post('/ai/recommend', { candidateId });

// Platform Integration
export const syncToPlatform = (dataType, payload) => api.post('/platform/sync', { dataType, payload });

export default api;

// ═══════════════════════════════════════════════════════════════
// TGM SSO AUTH API
// ═══════════════════════════════════════════════════════════════

function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(payload));
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;
    return decoded;
  } catch { return null; }
}

export const authApi = {
  decodeToken: decodeJwtPayload,
  setToken: (token) => {
    localStorage.setItem('auth_token', token);
  },
  getToken: () => localStorage.getItem('auth_token'),
  setUser: (user) => {
    localStorage.setItem('interview9_user', JSON.stringify(user));
  },
  getUser: () => {
    try {
      const u = localStorage.getItem('interview9_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  },
  clearAuth: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('interview9_user');
  },
  isAuthenticated: () => {
    const token = localStorage.getItem('auth_token');
    return token ? !!decodeJwtPayload(token) : false;
  },
};
