/**
 * Authentication utility functions for AWS Cognito
 */

const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN || 'us-east-1cjfhgfmkc.auth.us-east-1.amazoncognito.com'
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID || '3hvaqou47k64shd2qmra5211sb'
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'https://d1k8502xw64gvv.cloudfront.net'
const TOKEN_KEY = 'familyCloudIdToken'
const ACCESS_TOKEN_KEY = 'familyCloudAccessToken'

/**
 * Get the Cognito login URL
 * @returns {string} The Cognito Hosted UI login URL
 */
export const getCognitoLoginUrl = () => {
  const redirectUri = encodeURIComponent(REDIRECT_URI)
  const loginUrl = `https://${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${redirectUri}`
  return loginUrl
}

/**
 * Get the Cognito signup URL
 * @returns {string} The Cognito Hosted UI signup URL
 */
export const getCognitoSignupUrl = () => {
  const redirectUri = encodeURIComponent(REDIRECT_URI)
  const signupUrl = `https://${COGNITO_DOMAIN}/signup?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${redirectUri}`
  return signupUrl
}

/**
 * Get the Cognito logout URL
 * @returns {string} The Cognito Hosted UI logout URL
 */
export const getCognitoLogoutUrl = () => {
  const redirectUri = encodeURIComponent(REDIRECT_URI)
  const logoutUrl = `https://${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${redirectUri}`
  return logoutUrl
}

/**
 * Parse tokens from URL hash (Cognito redirect)
 * @param {string} hash - The URL hash from Cognito redirect
 * @returns {Object|null} Object with idToken, accessToken, expiresIn, or null
 */
export const parseTokensFromHash = (hash) => {
  if (!hash) return null

  const params = new URLSearchParams(hash.substring(1)) // Remove the '#' character
  
  const idToken = params.get('id_token')
  const accessToken = params.get('access_token')
  const expiresIn = params.get('expires_in')
  const tokenType = params.get('token_type')
  const error = params.get('error')
  const errorDescription = params.get('error_description')

  if (error) {
    console.error('Cognito error:', error, errorDescription)
    return { error, errorDescription }
  }

  if (!idToken || !accessToken) {
    return null
  }

  return {
    idToken,
    accessToken,
    expiresIn: expiresIn ? parseInt(expiresIn, 10) : null,
    tokenType: tokenType || 'Bearer',
  }
}

/**
 * Save tokens to localStorage
 * @param {string} idToken - The ID token from Cognito
 * @param {string} accessToken - The access token from Cognito
 */
export const saveTokens = (idToken, accessToken) => {
  localStorage.setItem(TOKEN_KEY, idToken)
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  
  // Also save to 'authToken' for backward compatibility with existing code
  localStorage.setItem('authToken', idToken)
}

/**
 * Get the ID token from localStorage
 * @returns {string|null} The ID token or null
 */
export const getIdToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Get the access token from localStorage
 * @returns {string|null} The access token or null
 */
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
export const isAuthenticated = () => {
  const token = getIdToken()
  return token !== null && token !== undefined && token !== ''
}

/**
 * Clear all authentication tokens
 */
export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem('authToken')
  localStorage.removeItem('devAuthToken')
}

/**
 * Decode JWT token to get user info (without verification)
 * @param {string} token - The JWT token
 * @returns {Object|null} Decoded token payload or null
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

/**
 * Get user info from the stored ID token
 * @returns {Object|null} User info object or null
 */
export const getUserInfo = () => {
  const token = getIdToken()
  if (!token) return null

  const decoded = decodeToken(token)
  if (!decoded) return null

  return {
    sub: decoded.sub,
    email: decoded.email,
    email_verified: decoded.email_verified,
    name: decoded.name || decoded['cognito:username'] || decoded.email,
    username: decoded['cognito:username'] || decoded.email,
  }
}
