/**
 * Playlists Page
 * 
 * Main page showing all playlists in a grid
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PlaylistGrid from '../components/PlaylistGrid'
import CreatePlaylistModal from '../components/CreatePlaylistModal'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'
import { getPlaylists, createPlaylist } from '../utils/playlists'
import { fetchVideos } from '../utils/api'
import Button from '../components/ui/Button'

const PlaylistsPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { activeProfile, loading: profileLoading } = useProfile()
  const [playlists, setPlaylists] = useState([])
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

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

    // Load playlists and videos
    loadData()
  }, [navigate, isAuthenticated, authLoading, activeProfile, profileLoading])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [playlistsData, videosData] = await Promise.all([
        Promise.resolve(getPlaylists()),
        fetchVideos(),
      ])
      setPlaylists(playlistsData)
      setVideos(videosData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePlaylist = (playlistData) => {
    const newPlaylist = createPlaylist(playlistData)
    setPlaylists((prev) => [...prev, newPlaylist])
    // Navigate to the new playlist
    navigate(`/playlists/${newPlaylist.id}`)
  }

  if (authLoading || profileLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-white/80">Loading playlists...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Family Playlists
              </h1>
              <p className="text-white/60 text-lg">
                Organize your videos into themed collections
              </p>
            </div>
            
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowCreateModal(true)}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Playlist
            </Button>
          </div>
        </div>

        {/* Playlists Grid */}
        <PlaylistGrid playlists={playlists} videos={videos} />
      </div>

      <Footer />

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreatePlaylist}
      />
    </div>
  )
}

export default PlaylistsPage
