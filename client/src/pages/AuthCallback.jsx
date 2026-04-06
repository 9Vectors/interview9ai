import { useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'

const TGM_URL = import.meta.env.VITE_TGM_URL || 'https://test.thegreymatter.ai'

export default function AuthCallback({ onSuccess }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const processedRef = useRef(false)

  useEffect(() => {
    if (processedRef.current) return
    processedRef.current = true

    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (error || !token) {
      console.error('Auth callback error:', error || 'No token received')
      window.location.replace(TGM_URL)
      return
    }

    const user = authApi.decodeToken(token)
    if (!user) {
      console.error('Auth callback: invalid or expired token')
      window.location.replace(TGM_URL)
      return
    }

    authApi.setToken(token)
    authApi.setUser(user)

    if (onSuccess) onSuccess(user)

    navigate('/app', { replace: true })
  }, [searchParams, navigate, onSuccess])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E8F4F8 0%, #B5D5E2 100%)' }}>
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: 'rgba(39, 101, 120, 0.3)' }} />
          <div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: '#E5A33A' }} />
        </div>
        <p className="text-sm font-medium" style={{ color: '#666666' }}>Completing sign in...</p>
      </div>
    </div>
  )
}
