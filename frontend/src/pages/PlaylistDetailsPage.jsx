/**
 * Playlist Details Page
 * 
 * Shows videos in a specific playlist
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import VideoCardNetflix from '../components/VideoCardNetflix'
import VideoGrid from '../components/VideoGrid'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'
import { getPlaylistById, deletePlaylist, removeVideoFromPlaylist } from '../utils/playlists'
import { fetchVideos } from '../utils/api'

const PlaylistDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { activeProfile, loading: profileLoading } = useProfile()
  const [playlist, setPlaylist] = useState(null)
  const [playlistVideos, setPlaylistVideos] = useState([])
  const [allVideos, setAllVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    // Wait for auth and profile checks
    if (authLoading || profileLoading) return

    // Check authentication
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    // Check if profile is selected
    if (!activeProfile) {
      navigate('/profiles')
      return
    }

    // Load playlist and videos
    loadPlaylist()
  }, [id, navigate, isAuthenticated, authLoading, activeProfile, profileLoading])

  const loadPlaylist = async () => {
    try {
      setIsLoading(true)
      const playlistData = getPlaylistById(id)
      
      if (!playlistData) {
        navigate('/playlists')
        return
      }

      setPlaylist(playlistData)

      // Load all videos
      const videos = await fetchVideos()
      setAllVideos(videos)

      // Filter videos that are in this playlist
      const videosInPlaylist = playlistData.videoIds
        ?.map((videoId) => videos.find((v) => v.id === videoId))
        .filter(Boolean) || []

      setPlaylistVideos(videosInPlaylist)
    } catch (error) {
      console.error('Error loading playlist:', error)
      navigate('/playlists')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePlaylist = () => {
    if (deletePlaylist(id)) {
      navigate('/playlists')
    }
  }

  const handleRemoveVideo = (videoId) => {
    removeVideoFromPlaylist(id, videoId)
    // Reload playlist
    loadPlaylist()
  }

  if (authLoading || profileLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-white/80">Loading playlist...</p>
        </div>
      </div>
    )
  }

  if (!playlist) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/playlists"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to Playlists</span>
        </Link>

        {/* Playlist Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                {playlist.name}
              </h1>
              {playlist.description && (
                <p className="text-white/60 text-lg mb-4">
                  {playlist.description}
                </p>
              )}
              <p className="text-white/40 text-sm">
                {playlist.videoCount || playlistVideos.length} {playlist.videoCount === 1 ? 'video' : 'videos'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white border border-white/20 rounded hover:border-white/40 transition-colors"
              >
                Delete Playlist
              </button>
            </div>
          </div>
        </div>

        {/* Videos in Playlist */}
        {playlistVideos.length > 0 ? (
          <VideoGrid
            title="Videos in this Playlist"
            videos={playlistVideos}
            isLarge={true}
          />
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
              <svg
                className="w-8 h-8 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">This playlist is empty</h3>
            <p className="text-white/60 mb-6">Add videos to this playlist to get started</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Videos
            </Link>
          </div>
        )}
      </div>

      <Footer />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Delete Playlist?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{playlist.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlaylist}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlaylistDetailsPage
