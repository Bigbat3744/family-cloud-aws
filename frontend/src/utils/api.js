/**
 * API Utility Functions
 * 
 * This file provides wrapper functions that integrate with the Kẹbíjọ API client.
 * It maintains backward compatibility while using the production API client.
 */

import { 
  fetchVideos as apiFetchVideos,
  fetchPlaybackUrl as apiFetchPlaybackUrl,
  initiateUpload as apiInitiateUpload,
  saveVideoMetadata as apiSaveVideoMetadata,
} from '../api/keBIJOApi'
import { getIdToken, getCognitoLoginUrl } from '../utils/auth'

/**
 * Fetch all videos for the authenticated user
 * @returns {Promise<Array>} Array of video metadata objects
 */
export const fetchVideos = async () => {
  const token = getIdToken()
  
  if (!token) {
    throw new Error('Authentication required')
  }

  try {
    return await apiFetchVideos(token)
  } catch (error) {
    console.error('Error fetching videos:', error)
    throw error
  }
}


/**
 * Fetch playback URL for a specific video
 * This calls the /play/{videoId} endpoint to get a presigned URL
 * @param {string} videoId - The ID of the video
 * @returns {Promise<string>} Presigned URL for video playback
 */
export const fetchPlaybackUrl = async (videoId) => {
  const token = getIdToken()
  
  if (!token) {
    throw new Error('Authentication required')
  }

  try {
    return await apiFetchPlaybackUrl(videoId, token)
  } catch (error) {
    console.error(`Error fetching playback URL for video ${videoId}:`, error)
    throw error
  }
}

/**
 * Redirect to AWS Cognito Hosted UI for authentication
 * @deprecated Use getCognitoLoginUrl() from utils/auth.js instead
 */
export const loginWithCognito = () => {
  // Use the auth.js function for consistency
  window.location.href = getCognitoLoginUrl()
}

/**
 * Get authentication token from localStorage
 * @returns {string|null} JWT token or null if not authenticated
 */
export const getAuthToken = () => {
  // Use the token from auth.js (familyCloudIdToken)
  return localStorage.getItem('familyCloudIdToken') || localStorage.getItem('authToken')
}

/**
 * Handle video play action
 * @param {string} videoId - The ID of the video to play
 * @returns {Promise<void>}
 */
export const handlePlay = async (videoId) => {
  // TODO: Replace with actual video playback logic
  // This could open a modal, navigate to a player page, or start streaming
  console.log('Playing video:', videoId)
  
  // Placeholder: Fetch playback URL and handle playback
  try {
    const playbackUrl = await fetchPlaybackUrl(videoId)
    // In a real implementation, you would:
    // - Open a video player modal
    // - Navigate to a player page
    // - Or start streaming the video
    console.log('Playback URL:', playbackUrl)
    return playbackUrl
  } catch (error) {
    console.error('Error playing video:', error)
    throw error
  }
}

/**
 * Get presigned URL for S3 upload
 * @param {string} filename - The name of the file to upload
 * @param {string} contentType - The MIME type of the file
 * @returns {Promise<Object>} Object with uploadUrl and videoId
 */
export const getPresignedUploadUrl = async (filename, contentType) => {
  const token = getIdToken()
  
  if (!token) {
    throw new Error('Authentication required')
  }

  try {
    const result = await apiInitiateUpload(filename, token, { contentType })
    return {
      uploadUrl: result.uploadUrl,
      videoId: result.videoId,
    }
  } catch (error) {
    console.error('Error getting presigned upload URL:', error)
    throw error
  }
}

/**
 * Save video metadata to backend after upload
 * @param {Object} metadata - Video metadata object
 * @param {string} videoId - Optional video ID if already created
 * @returns {Promise<Object>} Saved video metadata
 */
export const saveMetadataToBackend = async (metadata, videoId = null) => {
  const token = getIdToken()
  
  if (!token) {
    throw new Error('Authentication required')
  }

  try {
    // If videoId is provided, update existing video
    if (videoId) {
      return await apiSaveVideoMetadata(videoId, metadata, token)
    }
    
    // Otherwise, create new video (this would require a POST /videos endpoint)
    // For now, we'll use the initiateUpload response which includes videoId
    // In production, you might have a separate endpoint for creating video records
    throw new Error('Video ID is required. Use initiateUpload first to get videoId.')
  } catch (error) {
    console.error('Error saving video metadata:', error)
    throw error
  }
}

/**
 * Upload file directly to S3 using presigned URL
 * @param {File} file - The file to upload
 * @param {string} presignedUrl - The presigned S3 URL
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<void>}
 */
export const uploadToS3 = async (file, presignedUrl, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = (e.loaded / e.total) * 100
        onProgress(percentComplete)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status === 200 || xhr.status === 204) {
        resolve()
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'))
    })

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'))
    })

    xhr.open('PUT', presignedUrl)
    xhr.setRequestHeader('Content-Type', file.type)
    xhr.send(file)
  })
}

/**
 * Handle video upload (legacy function for backward compatibility)
 * @param {File} file - The video file to upload
 * @returns {Promise<Object>} Upload response with video metadata
 */
export const handleUpload = async (file) => {
  // This function is deprecated - use getPresignedUploadUrl and uploadToS3 instead
  // Kept for backward compatibility only
  console.warn('handleUpload is deprecated. Use getPresignedUploadUrl and uploadToS3 instead.')
  
  const token = getIdToken()
  if (!token) {
    throw new Error('Authentication required')
  }

  // Use the new upload flow
  const { uploadUrl, videoId } = await getPresignedUploadUrl(file.name, file.type)
  await uploadToS3(file, uploadUrl, () => {})
  
  const metadata = {
    title: file.name.replace(/\.[^/.]+$/, ''),
    filename: file.name,
    size: file.size,
    contentType: file.type,
  }
  
  const savedVideo = await saveMetadataToBackend(metadata, videoId)
  return savedVideo
}
