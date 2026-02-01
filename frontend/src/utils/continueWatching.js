/**
 * Continue Watching Utilities
 * 
 * Manages continue watching data (videos with watch progress)
 */

import { getApiUrl, API_ENDPOINTS } from '../config/api'
import { getIdToken } from './auth'

const CONTINUE_WATCHING_STORAGE_KEY = 'kebijo_continue_watching'

/**
 * Get continue watching data for a profile
 * @param {string} profileId - The profile ID
 * @returns {Promise<Array>} Array of continue watching items
 */
export const fetchContinueWatching = async (profileId) => {
  const token = getIdToken()
  
  // Try API endpoint first if authenticated
  if (token && profileId) {
    try {
      const url = `${getApiUrl(API_ENDPOINTS.CONTINUE_WATCHING)}?profileId=${encodeURIComponent(profileId)}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        const continueWatchingData = data.videos || data.items || data || []
        // Cache the result
        saveContinueWatching(profileId, continueWatchingData)
        return continueWatchingData
      }
    } catch (error) {
      console.error('Error fetching continue watching from API:', error)
      // Fall through to localStorage check
    }
  }

  // Fallback: Check localStorage
  try {
    const stored = localStorage.getItem(`${CONTINUE_WATCHING_STORAGE_KEY}_${profileId}`)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error)
  }

  // Return empty array if nothing found
  return []
}

/**
 * Save continue watching data for a profile
 * @param {string} profileId - The profile ID
 * @param {Array} data - Array of continue watching items
 */
export const saveContinueWatching = (profileId, data) => {
  try {
    localStorage.setItem(
      `${CONTINUE_WATCHING_STORAGE_KEY}_${profileId}`,
      JSON.stringify(data)
    )
  } catch (error) {
    console.error('Error saving continue watching:', error)
  }
}

/**
 * Update watch progress for a video
 * @param {string} profileId - The profile ID
 * @param {string} videoId - The video ID
 * @param {number} progress - Progress value (0-1)
 * @param {Object} video - Video metadata
 */
export const updateWatchProgress = (profileId, videoId, progress, video) => {
  try {
    const current = localStorage.getItem(`${CONTINUE_WATCHING_STORAGE_KEY}_${profileId}`)
    let continueWatching = current ? JSON.parse(current) : []

    // Find existing entry
    const existingIndex = continueWatching.findIndex(
      (item) => item.video.id === videoId
    )

    if (existingIndex >= 0) {
      // Update existing entry
      continueWatching[existingIndex] = {
        ...continueWatching[existingIndex],
        progress,
        lastWatchedAt: new Date().toISOString(),
      }
    } else {
      // Add new entry
      continueWatching.push({
        video: {
          id: videoId,
          title: video.title || 'Untitled',
          thumbnail: video.thumbnail || null,
          duration: video.duration || null,
          uploadedAt: video.uploadedAt || new Date().toISOString(),
        },
        progress,
        lastWatchedAt: new Date().toISOString(),
      })
    }

    // Sort by last watched (most recent first)
    continueWatching.sort((a, b) => {
      return new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt)
    })

    // Keep only last 20 items
    continueWatching = continueWatching.slice(0, 20)

    saveContinueWatching(profileId, continueWatching)
  } catch (error) {
    console.error('Error updating watch progress:', error)
  }
}

/**
 * Remove a video from continue watching (when completed or removed)
 * @param {string} profileId - The profile ID
 * @param {string} videoId - The video ID
 */
export const removeFromContinueWatching = (profileId, videoId) => {
  try {
    const current = localStorage.getItem(`${CONTINUE_WATCHING_STORAGE_KEY}_${profileId}`)
    if (!current) return

    const continueWatching = JSON.parse(current)
    const filtered = continueWatching.filter((item) => item.video.id !== videoId)
    saveContinueWatching(profileId, filtered)
  } catch (error) {
    console.error('Error removing from continue watching:', error)
  }
}

/**
 * Clear all continue watching data for a profile
 * @param {string} profileId - The profile ID
 */
export const clearContinueWatching = (profileId) => {
  try {
    localStorage.removeItem(`${CONTINUE_WATCHING_STORAGE_KEY}_${profileId}`)
  } catch (error) {
    console.error('Error clearing continue watching:', error)
  }
}
