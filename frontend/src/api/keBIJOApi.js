/**
 * Kẹbíjọ API Client
 * 
 * Production-ready API client for communicating with AWS API Gateway endpoints.
 * All endpoints require Cognito IdToken authentication.
 */

import { API_BASE_URL, API_ENDPOINTS, getApiUrl } from '../config/api'

/**
 * Default retry configuration
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // milliseconds
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
}

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Create headers with Authorization token
 * @param {string} token - Cognito IdToken
 * @param {Object} additionalHeaders - Additional headers to include
 * @returns {Object} Headers object
 */
const createHeaders = (token, additionalHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

/**
 * Handle API response and throw errors for non-200 status codes
 * @param {Response} response - Fetch response object
 * @returns {Promise<Object>} Parsed JSON response
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`
    
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorData.error || errorMessage
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage
    }

    const error = new Error(errorMessage)
    error.status = response.status
    error.response = response
    throw error
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return await response.json()
  }
  
  // Return text for non-JSON responses
  const text = await response.text()
  return text ? JSON.parse(text) : {}
}

/**
 * Make API request with retry logic
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @param {number} retryCount - Current retry attempt
 * @returns {Promise<Object>} API response
 */
const makeRequest = async (url, options = {}, retryCount = 0) => {
  try {
    const response = await fetch(url, options)
    
    // If request failed and is retryable, attempt retry
    if (!response.ok && retryCount < RETRY_CONFIG.maxRetries) {
      const isRetryable = RETRY_CONFIG.retryableStatusCodes.includes(response.status)
      
      if (isRetryable) {
        const delay = RETRY_CONFIG.retryDelay * Math.pow(2, retryCount) // Exponential backoff
        console.warn(`Request failed with status ${response.status}. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})`)
        
        await sleep(delay)
        return makeRequest(url, options, retryCount + 1)
      }
    }
    
    return await handleResponse(response)
  } catch (error) {
    // Network errors or other failures
    if (retryCount < RETRY_CONFIG.maxRetries && !error.status) {
      const delay = RETRY_CONFIG.retryDelay * Math.pow(2, retryCount)
      console.warn(`Request failed: ${error.message}. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})`)
      
      await sleep(delay)
      return makeRequest(url, options, retryCount + 1)
    }
    
    // Log error for debugging
    console.error('API request failed:', {
      url,
      error: error.message,
      status: error.status,
    })
    
    throw error
  }
}

/**
 * Fetch all videos for the authenticated user
 * @param {string} token - Cognito IdToken
 * @returns {Promise<Array>} Array of video metadata objects
 */
export const fetchVideos = async (token) => {
  if (!token) {
    throw new Error('Authentication token is required')
  }

  const url = getApiUrl(API_ENDPOINTS.VIDEOS)
  const options = {
    method: 'GET',
    headers: createHeaders(token),
  }

  try {
    const response = await makeRequest(url, options)
    return response.videos || response.data || response || []
  } catch (error) {
    console.error('Error fetching videos:', error)
    throw new Error(`Failed to fetch videos: ${error.message}`)
  }
}

/**
 * Fetch playback URL for a specific video
 * @param {string} videoId - The ID of the video
 * @param {string} token - Cognito IdToken
 * @returns {Promise<string>} Presigned CloudFront URL for video playback
 */
export const fetchPlaybackUrl = async (videoId, token) => {
  if (!token) {
    throw new Error('Authentication token is required')
  }

  if (!videoId) {
    throw new Error('Video ID is required')
  }

  const url = getApiUrl(API_ENDPOINTS.PLAY(videoId))
  const options = {
    method: 'GET',
    headers: createHeaders(token),
  }

  try {
    const response = await makeRequest(url, options)
    return response.playbackUrl || response.url || response.playback_url || response
  } catch (error) {
    console.error(`Error fetching playback URL for video ${videoId}:`, error)
    throw new Error(`Failed to fetch playback URL: ${error.message}`)
  }
}

/**
 * Initiate video upload and get presigned S3 URL
 * @param {string} filename - Name of the file to upload
 * @param {string} token - Cognito IdToken
 * @param {Object} metadata - Optional metadata (contentType, size, etc.)
 * @returns {Promise<Object>} Object containing uploadUrl and videoId
 */
export const initiateUpload = async (filename, token, metadata = {}) => {
  if (!token) {
    throw new Error('Authentication token is required')
  }

  if (!filename) {
    throw new Error('Filename is required')
  }

  const url = getApiUrl(API_ENDPOINTS.UPLOAD_INITIATE)
  const options = {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify({
      filename,
      ...metadata,
    }),
  }

  try {
    const response = await makeRequest(url, options)
    return {
      uploadUrl: response.uploadUrl || response.upload_url || response.url,
      videoId: response.videoId || response.video_id || response.id,
      ...response,
    }
  } catch (error) {
    console.error('Error initiating upload:', error)
    throw new Error(`Failed to initiate upload: ${error.message}`)
  }
}

/**
 * Save video metadata after successful upload
 * @param {string} videoId - The ID of the uploaded video
 * @param {Object} metadata - Video metadata (title, duration, size, etc.)
 * @param {string} token - Cognito IdToken
 * @returns {Promise<Object>} Saved video metadata
 */
export const saveVideoMetadata = async (videoId, metadata, token) => {
  if (!token) {
    throw new Error('Authentication token is required')
  }

  if (!videoId) {
    throw new Error('Video ID is required')
  }

  const url = getApiUrl(API_ENDPOINTS.VIDEO(videoId))
  const options = {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify(metadata),
  }

  try {
    const response = await makeRequest(url, options)
    return response.video || response.data || response
  } catch (error) {
    console.error(`Error saving metadata for video ${videoId}:`, error)
    throw new Error(`Failed to save video metadata: ${error.message}`)
  }
}

/**
 * Delete a video
 * @param {string} videoId - The ID of the video to delete
 * @param {string} token - Cognito IdToken
 * @returns {Promise<void>}
 */
export const deleteVideo = async (videoId, token) => {
  if (!token) {
    throw new Error('Authentication token is required')
  }

  if (!videoId) {
    throw new Error('Video ID is required')
  }

  const url = getApiUrl(API_ENDPOINTS.VIDEO(videoId))
  const options = {
    method: 'DELETE',
    headers: createHeaders(token),
  }

  try {
    await makeRequest(url, options)
  } catch (error) {
    console.error(`Error deleting video ${videoId}:`, error)
    throw new Error(`Failed to delete video: ${error.message}`)
  }
}

export default {
  fetchVideos,
  fetchPlaybackUrl,
  initiateUpload,
  saveVideoMetadata,
  deleteVideo,
}
