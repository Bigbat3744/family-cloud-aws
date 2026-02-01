/**
 * API Configuration
 * 
 * Single source of truth for API base URL and endpoints
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  'https://1hshn8sqfa.execute-api.us-east-1.amazonaws.com/prod'

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  VIDEOS: '/videos',
  VIDEO: (id) => `/videos/${id}`,
  PLAY: (id) => `/play/${id}`,
  UPLOAD_INITIATE: '/upload/initiate',
  SEARCH: '/search',
  CONTINUE_WATCHING: '/continue-watching',
}

/**
 * Get full API URL for an endpoint
 * @param {string} endpoint - API endpoint path
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`
}

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  getApiUrl,
}
