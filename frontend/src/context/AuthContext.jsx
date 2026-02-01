import { createContext, useContext, useState, useEffect } from 'react'
import { isAuthenticated, getUserInfo, clearTokens } from '../utils/auth'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication status on mount
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      if (isAuthenticated()) {
        const userInfo = getUserInfo()
        setUser(userInfo)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = (idToken, accessToken) => {
    // Tokens are saved in auth.js parseTokensFromHash
    // Just update user state
    const userInfo = getUserInfo()
    setUser(userInfo)
  }

  const logout = () => {
    clearTokens()
    setUser(null)
    // Navigation will be handled by the component calling logout
  }

  const value = {
    user,
    isAuthenticated: isAuthenticated(),
    loading,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
