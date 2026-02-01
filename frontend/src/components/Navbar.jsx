import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getCognitoLogoutUrl } from '../utils/auth'
import { useProfile } from '../context/ProfileContext'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isDashboard = location.pathname === '/dashboard'
  const { user, logout, isAuthenticated } = useAuth()
  const { activeProfile, switchProfile } = useProfile()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const handleLogout = () => {
    logout()
    // Redirect to Cognito logout URL
    window.location.href = getCognitoLogoutUrl()
  }

  const handleSwitchProfile = () => {
    switchProfile()
    setShowProfileMenu(false)
  }

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  const isHomePage = location.pathname === '/'

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isHomePage 
        ? 'bg-transparent' 
        : 'bg-black/80 backdrop-blur-md border-b border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <span className={`text-2xl font-bold tracking-tight ${
                isHomePage ? 'text-white' : 'text-white'
              }`}>
                Kẹbíjọ
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && isDashboard && activeProfile && (
              <>
                {/* Profile Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-white font-semibold text-sm"
                      style={{ backgroundColor: activeProfile.color || '#0066e6' }}
                    >
                      {getInitials(activeProfile.name)}
                    </div>
                    <span className="text-sm text-white/80 hidden md:block">
                      {activeProfile.name}
                    </span>
                    <svg
                      className={`w-4 h-4 text-white/60 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowProfileMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-50 overflow-hidden">
                        <button
                          onClick={handleSwitchProfile}
                          className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                          </svg>
                          Switch Profile
                        </button>
                        <div className="border-t border-white/10" />
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
            {!isDashboard && (
              <>
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                  >
                    My Videos
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/dashboard"
                      className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
