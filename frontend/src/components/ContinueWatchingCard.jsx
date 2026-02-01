/**
 * Continue Watching Card Component
 * 
 * Netflix-style card showing partially watched videos with progress bar
 */

import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const ContinueWatchingCard = ({ video, progress = 0 }) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    navigate(`/video/${video.id}`)
  }

  const handleResume = (e) => {
    e.stopPropagation()
    navigate(`/video/${video.id}`)
  }

  // Format progress percentage
  const progressPercent = Math.round(progress * 100)

  return (
    <div
      className="relative group cursor-pointer min-w-[200px] md:min-w-[240px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Thumbnail Container */}
      <div
        className={`
          relative aspect-video rounded-lg overflow-hidden mb-2
          transition-all duration-300 ease-out
          ${isHovered ? 'scale-105 shadow-2xl' : 'scale-100 shadow-lg'}
        `}
      >
        {/* Thumbnail Image */}
        <div className="relative aspect-video bg-gradient-to-br from-primary-800 to-primary-900">
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

          {/* Resume Button Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-all duration-300">
              <button
                onClick={handleResume}
                className="bg-white/95 hover:bg-white rounded-full px-6 py-3 flex items-center gap-2 transform scale-100 hover:scale-110 transition-transform shadow-xl"
              >
                <svg
                  className="w-5 h-5 text-primary-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                <span className="text-primary-600 font-semibold text-sm">Resume</span>
              </button>
            </div>
          )}

          {/* Duration Badge */}
          {video.duration && (
            <div className="absolute top-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded backdrop-blur-sm">
              {video.duration}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Video Info */}
      <div className="px-1">
        <h3 className="text-white text-sm font-medium line-clamp-1 group-hover:text-blue-500 transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-white/60 text-xs">{progressPercent}% watched</span>
          {video.uploadedAt && (
            <>
              <span className="text-white/40 text-xs">•</span>
              <span className="text-white/60 text-xs">
                {new Date(video.uploadedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContinueWatchingCard
