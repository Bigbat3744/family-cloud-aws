/**
 * Login Page - Netflix-style Authentication
 */

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { getCognitoLoginUrl, getCognitoSignupUrl } from '../utils/auth'

const LoginPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleLogin = () => {
    const loginUrl = getCognitoLoginUrl()
    window.location.href = loginUrl
  }

  const handleSignup = () => {
    const signupUrl = getCognitoSignupUrl()
    window.location.href = signupUrl
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 min-h-[80vh]">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg blur-md opacity-50" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">K</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white">Kẹbíjọ</h1>
            </div>
            <p className="text-white/60 text-lg">Where family memories come together</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-white/70">Sign in to access your family videos</p>
            </div>

            <button
              onClick={handleLogin}
              className="w-full px-6 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Sign In</span>
            </button>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-white/60 text-center">
                Secure authentication powered by AWS Cognito
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/60">
              Don't have an account?{' '}
              <button
                onClick={handleSignup}
                className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default LoginPage
