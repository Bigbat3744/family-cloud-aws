import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import VideoPlayer from '../components/VideoPlayer'
import VideoMetadata from '../components/VideoMetadata'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'
import { fetchPlaybackUrl, fetchVideos } from '../utils/api'

const VideoPlayerPage = () => {
  const { videoId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { activeProfile, loading: profileLoading } = useProfile()
  const [playbackUrl, setPlaybackUrl] = useState(null)
  const [video, setVideo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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

    // Load video data and playback URL
    loadVideo()
  }, [videoId, isAuthenticated, authLoading, activeProfile, profileLoading, navigate])

  const loadVideo = async () => {
    if (!videoId) {
      setError('No video ID provided')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Fetch playback URL
      const url = await fetchPlaybackUrl(videoId)
      setPlaybackUrl(url)

      // Fetch video metadata from the videos list
      const videos = await fetchVideos()
      const foundVideo = videos.find((v) => v.id === videoId)
      
      if (foundVideo) {
        setVideo(foundVideo)
      } else {
        // If not found in list, create placeholder metadata
        setVideo({
          id: videoId,
          title: 'Video',
          uploadedAt: new Date().toISOString(),
          duration: '0:00',
          size: null,
        })
      }
    } catch (err) {
      console.error('Error loading video:', err)
      setError('Failed to load video. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600">
              {authLoading ? 'Checking authentication...' : 'Loading video...'}
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Video</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
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
              Back to Dashboard
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
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
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          {video && (
            <h1 className="text-3xl font-bold text-gray-900">{video.title}</h1>
          )}
        </div>

        {/* Video Player and Metadata Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <VideoPlayer videoUrl={playbackUrl} videoTitle={video?.title} />
          </div>

          {/* Video Metadata - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <VideoMetadata video={video} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default VideoPlayerPage
