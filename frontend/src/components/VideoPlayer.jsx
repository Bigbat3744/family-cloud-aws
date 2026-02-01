import { useState, useEffect } from 'react'

const VideoPlayer = ({ videoUrl, videoTitle }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (videoUrl) {
      setIsLoading(true)
      setError(null)
    }
  }, [videoUrl])

  if (!videoUrl) {
    return (
      <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center shadow-lg">
        <div className="text-center text-gray-400">
          <svg
            className="mx-auto h-16 w-16 mb-4"
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
          <p className="text-lg font-medium">No video URL provided</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg">
      <div className="relative aspect-video bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-400">Loading video...</p>
            </div>
          </div>
        )}
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center text-gray-400 px-4">
              <svg
                className="mx-auto h-16 w-16 mb-4"
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
              <p className="text-lg font-medium mb-2">Error loading video</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : (
          <video
            className="w-full h-full"
            controls
            autoPlay={false}
            preload="metadata"
            onLoadedData={() => {
              setIsLoading(false)
              setError(null)
            }}
            onCanPlay={() => {
              setIsLoading(false)
              setError(null)
            }}
            onError={(e) => {
              setIsLoading(false)
              setError('Failed to load video. The video URL may be invalid or expired.')
              console.error('Video error:', e)
            }}
            onLoadStart={() => {
              setIsLoading(true)
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="application/x-mpegURL" />
            <source src={videoUrl} type="application/dash+xml" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  )
}

export default VideoPlayer
