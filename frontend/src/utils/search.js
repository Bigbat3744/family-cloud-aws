/**
 * Search Utilities
 * 
 * Handles video search and filtering
 */

import { getApiUrl, API_ENDPOINTS } from '../config/api'
import { getIdToken } from './auth'

/**
 * Search videos by query
 * @param {string} query - Search query
 * @param {Array} videos - Array of all videos to search (fallback for client-side search)
 * @returns {Promise<Array>} Filtered videos matching the query
 */
export const searchVideos = async (query, videos = []) => {
  if (!query || !query.trim()) {
    return []
  }

  const token = getIdToken()
  
  // If authenticated, use API endpoint
  if (token) {
    try {
      const url = `${getApiUrl(API_ENDPOINTS.SEARCH)}?q=${encodeURIComponent(query)}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        return data.videos || data.results || data || []
      }
    } catch (error) {
      console.error('Error searching videos via API:', error)
      // Fall through to client-side search as fallback
    }
  }

  // Fallback: Client-side search if API fails or no token
  const searchTerm = query.toLowerCase().trim()
  const results = videos.filter((video) => {
    const title = (video.title || '').toLowerCase()
    const description = (video.description || '').toLowerCase()
    const tags = (video.tags || []).join(' ').toLowerCase()

    return (
      title.includes(searchTerm) ||
      description.includes(searchTerm) ||
      tags.includes(searchTerm)
    )
  })

  return results
}

/**
 * Get videos by category
 * @param {string} category - Category name
 * @param {Array} videos - Array of all videos
 * @returns {Array} Videos in the category
 */
export const getVideosByCategory = (category, videos = []) => {
  // Category mapping (in production, this would come from backend)
  const categoryMap = {
    'Family Trips': ['trip', 'vacation', 'travel', 'journey', 'adventure'],
    'Birthdays': ['birthday', 'celebration', 'party'],
    'Kids': ['kids', 'children', 'child', 'baby', 'toddler'],
    'Old Memories': ['old', 'vintage', 'archive', 'memory', 'past'],
    'Recently Added': [], // Will be sorted by date
  }

  if (category === 'Recently Added') {
    // Sort by upload date, most recent first
    return [...videos]
      .sort((a, b) => {
        const dateA = new Date(a.uploadedAt || 0)
        const dateB = new Date(b.uploadedAt || 0)
        return dateB - dateA
      })
      .slice(0, 10) // Limit to 10 most recent
  }

  const keywords = categoryMap[category] || []
  if (keywords.length === 0) {
    return []
  }

  return videos.filter((video) => {
    const title = (video.title || '').toLowerCase()
    const description = (video.description || '').toLowerCase()
    const tags = (video.tags || []).join(' ').toLowerCase()
    const searchText = `${title} ${description} ${tags}`

    return keywords.some((keyword) => searchText.includes(keyword.toLowerCase()))
  })
}

/**
 * Get all available categories
 * @returns {Array} Array of category names
 */
export const getCategories = () => {
  return [
    'Family Trips',
    'Birthdays',
    'Kids',
    'Old Memories',
    'Recently Added',
  ]
}

/**
 * Get category data with videos
 * @param {string} category - Category name
 * @param {Array} videos - Array of all videos
 * @returns {Object} Category object with videos
 */
export const getCategoryData = (category, videos) => {
  const categoryVideos = getVideosByCategory(category, videos)
  
  return {
    name: category,
    videos: categoryVideos,
    count: categoryVideos.length,
  }
}
