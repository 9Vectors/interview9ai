import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/common/Layout'
import Dashboard from './pages/Dashboard'
import QuestionLibrary from './pages/QuestionLibrary'
import InterviewBuilder from './pages/InterviewBuilder'
import Candidates from './pages/Candidates'
import Scoring from './pages/Scoring'
import ReferenceChecks from './pages/ReferenceChecks'
import AIInsights from './pages/AIInsights'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import AuthCallback from './pages/AuthCallback'
import { authApi } from './services/api'

export default function App() {
  const [user, setUser] = useState(() => authApi.getUser())
  const handleOAuthSuccess = useCallback((u) => setUser(u), [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback onSuccess={handleOAuthSuccess} />} />
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="/app" element={<Layout user={user} />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="questions" element={<QuestionLibrary />} />
          <Route path="builder" element={<InterviewBuilder />} />
          <Route path="candidates" element={<Candidates />} />
          <Route path="scoring" element={<Scoring />} />
          <Route path="references" element={<ReferenceChecks />} />
          <Route path="ai-insights" element={<AIInsights />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
