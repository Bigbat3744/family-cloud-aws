import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { parseTokensFromHash, saveTokens } from '../utils/auth'
import { useAuth } from '../context/AuthContext'

const AuthCallback = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Extract tokens from URL hash
    const hash = location.hash
    const tokens = parseTokensFromHash(hash)

    if (tokens?.error) {
      // Handle error from Cognito
      setError(tokens.errorDescription || tokens.error)
      setLoading(false)
      // Redirect to login after showing error
      setTimeout(() => {
        navigate('/login')
      }, 3000)
      return
    }

    if (!tokens || !tokens.idToken || !tokens.accessToken) {
      // No tokens found, redirect to login
      console.error('No tokens found in callback')
      setError('Authentication failed. No tokens received.')
      setLoading(false)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
      return
    }

    // Save tokens to localStorage
    try {
      saveTokens(tokens.idToken, tokens.accessToken)
      
      // Update auth context
      login(tokens.idToken, tokens.accessToken)
      
      // Clear the hash from URL
      window.history.replaceState(null, '', window.location.pathname)
      
      // Redirect to profile selection (user will select profile, then go to dashboard)
      navigate('/profiles', { replace: true })
    } catch (err) {
      console.error('Error processing tokens:', err)
      setError('Failed to process authentication tokens.')
      setLoading(false)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    }
  }, [location.hash, navigate, login])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Completing sign in...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return null
}

export default AuthCallback
