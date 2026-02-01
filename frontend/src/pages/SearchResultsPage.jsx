/**
 * Search Results Page
 * 
 * Displays search results in a Netflix-style grid
 */

import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import VideoGrid from '../components/VideoGrid'
import AddToPlaylistModal from '../components/AddToPlaylistModal'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'
import { fetchVideos } from '../utils/api'
import { searchVideos } from '../utils/search'

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { activeProfile, loading: profileLoading } = useProfile()
  const [allVideos, setAllVideos] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false)
  const [selectedVideoId, setSelectedVideoId] = useState(null)

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

    // Load videos and perform search
    loadVideosAndSearch()
  }, [query, navigate, isAuthenticated, authLoading, activeProfile, profileLoading])

  const loadVideosAndSearch = async () => {
    try {
      setIsLoading(true)
      const videos = await fetchVideos()
      setAllVideos(videos)

      if (query) {
        const results = await searchVideos(query, videos)
        setSearchResults(results)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error('Error loading search results:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || profileLoading || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-white/80">Searching...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {query ? `Search Results for "${query}"` : 'Search'}
          </h1>
          <p className="text-white/60 text-lg">
            {searchResults.length > 0
              ? `Found ${searchResults.length} ${searchResults.length === 1 ? 'video' : 'videos'}`
              : query
              ? 'No videos found'
              : 'Enter a search query to find videos'}
          </p>
        </div>

        {/* Search Results */}
        {query && searchResults.length > 0 ? (
          <VideoGrid
            title=""
            videos={searchResults}
            isLarge={true}
            onAddToPlaylist={(videoId) => {
              setSelectedVideoId(videoId)
              setShowAddToPlaylistModal(true)
            }}
          />
        ) : query && searchResults.length === 0 ? (
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-white/60 mb-6">
              Try a different search term or browse categories
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Videos
            </button>
          </div>
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Start searching</h3>
            <p className="text-white/60">
              Use the search bar to find videos by title, description, or tags
            </p>
          </div>
        )}
      </div>

      <Footer />

      {/* Add to Playlist Modal */}
      <AddToPlaylistModal
        isOpen={showAddToPlaylistModal}
        onClose={() => {
          setShowAddToPlaylistModal(false)
          setSelectedVideoId(null)
        }}
        videoId={selectedVideoId}
        onUpdate={() => {
          // Reload if needed
        }}
      />
    </div>
  )
}

export default SearchResultsPage
