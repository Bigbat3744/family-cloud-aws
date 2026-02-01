/**
 * Dashboard Page - Netflix-style Video Library
 * 
 * Features horizontal scrolling video rows like Netflix
 */

import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import VideoGrid from '../components/VideoGrid'
import ContinueWatchingRow from '../components/ContinueWatchingRow'
import SearchBar from '../components/SearchBar'
import AddToPlaylistModal from '../components/AddToPlaylistModal'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'
import { fetchVideos, handleUpload } from '../utils/api'
import { fetchContinueWatching } from '../utils/continueWatching'

const DashboardPage = () => {
  const [videos, setVideos] = useState([])
  const [continueWatching, setContinueWatching] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false)
  const [selectedVideoId, setSelectedVideoId] = useState(null)
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { activeProfile, loading: profileLoading } = useProfile()

  useEffect(() => {
    // Wait for auth check to complete
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

    // Fetch videos on mount
    loadVideos()
  }, [navigate, isAuthenticated, authLoading, activeProfile, profileLoading])

  const loadVideos = async () => {
    try {
      setIsLoading(true)
      const [videoList, continueWatchingData] = await Promise.all([
        fetchVideos(),
        activeProfile ? fetchContinueWatching(activeProfile.id) : Promise.resolve([]),
      ])
      setVideos(videoList)
      setContinueWatching(continueWatchingData)
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file')
      return
    }

    // Validate file size (e.g., max 500MB)
    const maxSize = 500 * 1024 * 1024 // 500MB
    if (file.size > maxSize) {
      alert('File size must be less than 500MB')
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const newVideo = await handleUpload(file)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      // Add new video to the list
      setVideos((prev) => [newVideo, ...prev])

      // Reset after a moment
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
        event.target.value = '' // Reset file input
      }, 500)
    } catch (error) {
      console.error('Error uploading video:', error)
      alert('Failed to upload video. Please try again.')
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // Organize videos into sections
  const myVideos = videos
  const recentlyAdded = [...videos].sort((a, b) => 
    new Date(b.uploadedAt) - new Date(a.uploadedAt)
  ).slice(0, 10)
  const familyMoments = videos.slice(0, 8)

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Main Content */}
      <div className="pt-8 pb-20">
        {/* Header Section */}
        <div className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {activeProfile ? `${activeProfile.name}'s Videos` : 'My Videos'}
                </h1>
                <p className="text-white/60 text-lg">
                  {videos.length} {videos.length === 1 ? 'video' : 'videos'} in your library
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="flex-shrink-0">
                <SearchBar />
              </div>
              
              {/* Upload Button */}
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg cursor-pointer transition-colors shadow-lg hover:shadow-xl">
                <input
                  type="file"
                  accept="video/*"
                  onChange={onUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Uploading... {uploadProgress}%</span>
                  </>
                ) : (
                  <>
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>Upload Video</span>
                  </>
                )}
              </label>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="mb-6">
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Sections */}
        {isLoading ? (
          <div className="flex items-center justify-center py-40">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-white/80 text-lg">Loading your videos...</p>
            </div>
          </div>
        ) : videos.length === 0 ? (
          <div className="px-4 sm:px-6 lg:px-8 py-40">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-white/40"
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
              <h2 className="text-3xl font-bold text-white mb-4">
                Start Building Your Family Library
              </h2>
              <p className="text-xl text-white/60 mb-8">
                Upload your first video to start sharing memories with your family
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Continue Watching Row */}
            {continueWatching.length > 0 && (
              <ContinueWatchingRow videos={continueWatching} />
            )}

            {myVideos.length > 0 && (
              <VideoGrid 
                title="My Videos" 
                videos={myVideos}
                isLarge={true}
                onAddToPlaylist={(videoId) => {
                  setSelectedVideoId(videoId)
                  setShowAddToPlaylistModal(true)
                }}
              />
            )}
            
            {recentlyAdded.length > 0 && (
              <VideoGrid 
                title="Recently Added" 
                videos={recentlyAdded}
                onAddToPlaylist={(videoId) => {
                  setSelectedVideoId(videoId)
                  setShowAddToPlaylistModal(true)
                }}
              />
            )}
            
            {familyMoments.length > 0 && (
              <VideoGrid 
                title="Family Moments" 
                videos={familyMoments}
                onAddToPlaylist={(videoId) => {
                  setSelectedVideoId(videoId)
                  setShowAddToPlaylistModal(true)
                }}
              />
            )}
          </>
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
          // Reload videos if needed
          loadVideos()
        }}
      />
    </div>
  )
}

export default DashboardPage
