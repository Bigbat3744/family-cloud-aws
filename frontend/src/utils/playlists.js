/**
 * Playlist Utilities
 * 
 * Manages playlist data storage and retrieval
 */

const PLAYLISTS_STORAGE_KEY = 'kebijo_playlists'

// Default placeholder playlists
export const DEFAULT_PLAYLISTS = [
  {
    id: '1',
    name: 'Christmas 2024',
    description: 'All our Christmas memories from 2024',
    thumbnail: null,
    videoIds: ['6', '5'],
    videoCount: 2,
    createdAt: '2024-12-25',
    updatedAt: '2024-12-25',
  },
  {
    id: '2',
    name: "Baby's First Year",
    description: 'Precious moments from the first year',
    thumbnail: null,
    videoIds: ['4', '2'],
    videoCount: 2,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: '3',
    name: 'Family Trips',
    description: 'Our adventures together',
    thumbnail: null,
    videoIds: ['1', '3'],
    videoCount: 2,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
  },
  {
    id: '4',
    name: 'Birthday Celebrations',
    description: 'All the birthday fun',
    thumbnail: null,
    videoIds: ['2'],
    videoCount: 1,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
]

/**
 * Get all playlists from localStorage
 * @returns {Array} Array of playlist objects
 */
export const getPlaylists = () => {
  try {
    const stored = localStorage.getItem(PLAYLISTS_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    // Initialize with default playlists
    savePlaylists(DEFAULT_PLAYLISTS)
    return DEFAULT_PLAYLISTS
  } catch (error) {
    console.error('Error loading playlists:', error)
    return DEFAULT_PLAYLISTS
  }
}

/**
 * Save playlists to localStorage
 * @param {Array} playlists - Array of playlist objects
 */
export const savePlaylists = (playlists) => {
  try {
    localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists))
  } catch (error) {
    console.error('Error saving playlists:', error)
  }
}

/**
 * Get a single playlist by ID
 * @param {string} playlistId - The playlist ID
 * @returns {Object|null} Playlist object or null
 */
export const getPlaylistById = (playlistId) => {
  const playlists = getPlaylists()
  return playlists.find((p) => p.id === playlistId) || null
}

/**
 * Create a new playlist
 * @param {Object} playlistData - Playlist data (name, description, etc.)
 * @returns {Object} Created playlist
 */
export const createPlaylist = (playlistData) => {
  const playlists = getPlaylists()
  const newPlaylist = {
    id: Date.now().toString(),
    name: playlistData.name,
    description: playlistData.description || '',
    thumbnail: null,
    videoIds: [],
    videoCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  const updatedPlaylists = [...playlists, newPlaylist]
  savePlaylists(updatedPlaylists)
  return newPlaylist
}

/**
 * Update a playlist
 * @param {string} playlistId - The playlist ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated playlist or null
 */
export const updatePlaylist = (playlistId, updates) => {
  const playlists = getPlaylists()
  const index = playlists.findIndex((p) => p.id === playlistId)
  
  if (index === -1) return null
  
  const updatedPlaylist = {
    ...playlists[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  playlists[index] = updatedPlaylist
  savePlaylists(playlists)
  return updatedPlaylist
}

/**
 * Delete a playlist
 * @param {string} playlistId - The playlist ID
 * @returns {boolean} True if deleted successfully
 */
export const deletePlaylist = (playlistId) => {
  const playlists = getPlaylists()
  const filtered = playlists.filter((p) => p.id !== playlistId)
  savePlaylists(filtered)
  return filtered.length < playlists.length
}

/**
 * Add video to playlist
 * @param {string} playlistId - The playlist ID
 * @param {string} videoId - The video ID to add
 * @returns {Object|null} Updated playlist or null
 */
export const addVideoToPlaylist = (playlistId, videoId) => {
  const playlist = getPlaylistById(playlistId)
  if (!playlist) return null
  
  if (playlist.videoIds.includes(videoId)) {
    return playlist // Video already in playlist
  }
  
  const updatedVideoIds = [...playlist.videoIds, videoId]
  return updatePlaylist(playlistId, {
    videoIds: updatedVideoIds,
    videoCount: updatedVideoIds.length,
  })
}

/**
 * Remove video from playlist
 * @param {string} playlistId - The playlist ID
 * @param {string} videoId - The video ID to remove
 * @returns {Object|null} Updated playlist or null
 */
export const removeVideoFromPlaylist = (playlistId, videoId) => {
  const playlist = getPlaylistById(playlistId)
  if (!playlist) return null
  
  const updatedVideoIds = playlist.videoIds.filter((id) => id !== videoId)
  return updatePlaylist(playlistId, {
    videoIds: updatedVideoIds,
    videoCount: updatedVideoIds.length,
  })
}

/**
 * Get playlists containing a specific video
 * @param {string} videoId - The video ID
 * @returns {Array} Array of playlist objects
 */
export const getPlaylistsForVideo = (videoId) => {
  const playlists = getPlaylists()
  return playlists.filter((p) => p.videoIds.includes(videoId))
}
