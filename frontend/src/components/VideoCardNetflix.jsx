/**
 * Netflix-Style Video Card Component
 * 
 * A video card with smooth hover animations and Netflix-style scaling
 */

import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const VideoCardNetflix = ({ video, isLarge = false, onAddToPlaylist }) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    navigate(`/video/${video.id}`)
  }

  const handleAddToPlaylist = (e) => {
    e.stopPropagation()
    onAddToPlaylist && onAddToPlaylist(video.id)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 ease-out ${
        isLarge ? 'min-w-[300px]' : 'min-w-[200px]'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Thumbnail Container */}
      <div
        className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
          isHovered
            ? 'scale-110 shadow-2xl z-20'
            : 'scale-100 shadow-lg'
        }`}
        style={{
          transform: isHovered ? 'scale(1.1) translateY(-10px)' : 'scale(1)',
        }}
      >
        {/* Thumbnail Image */}
        <div className={`relative ${isLarge ? 'aspect-[16/9]' : 'aspect-video'} bg-gradient-to-br from-primary-800 to-primary-900`}>
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-white/30"
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
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Duration Badge */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded backdrop-blur-sm">
              {video.duration}
            </div>
          )}

          {/* Play Button Overlay */}
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all duration-300">
              <div className="bg-white/90 rounded-full p-4 transform scale-100 hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-primary-600 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Info Card (appears on hover) */}
        {isHovered && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-4 rounded-b-lg transform translate-y-0 transition-all duration-300">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-white font-semibold text-sm flex-1 line-clamp-2">
                {video.title}
              </h3>
              {onAddToPlaylist && (
                <button
                  onClick={handleAddToPlaylist}
                  className="flex-shrink-0 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm"
                  title="Add to Playlist"
                >
                  <svg
                    className="w-4 h-4 text-white"
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
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-white/80">
              <span>{formatDate(video.uploadedAt)}</span>
              {video.size && (
                <>
                  <span>•</span>
                  <span>{(video.size / (1024 * 1024)).toFixed(1)} MB</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Title Below (when not hovered) */}
      {!isHovered && (
        <div className="mt-2 px-1">
          <h3 className="text-white text-sm font-medium line-clamp-2">
            {video.title}
          </h3>
        </div>
      )}
    </div>
  )
}

export default VideoCardNetflix
