/**
 * Playlist Card Component
 * 
 * Netflix-style playlist card with thumbnail and info
 */

import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const PlaylistCard = ({ playlist, videos = [] }) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  // Get thumbnail from first video or use placeholder
  const thumbnail = playlist.thumbnail || 
    (videos.length > 0 && videos[0]?.thumbnail) || 
    null

  const handleClick = () => {
    navigate(`/playlists/${playlist.id}`)
  }

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Thumbnail Container */}
      <div
        className={`
          relative aspect-video rounded-lg overflow-hidden mb-3
          transition-all duration-300 ease-out
          ${isHovered ? 'scale-105 shadow-2xl' : 'scale-100 shadow-lg'}
        `}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={playlist.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-white/40 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-white/40 text-xs">Playlist</p>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Video Count Badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">
          {playlist.videoCount || playlist.videoIds?.length || 0} {playlist.videoCount === 1 ? 'video' : 'videos'}
        </div>

        {/* Play Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-all duration-300">
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

      {/* Playlist Info */}
      <div>
        <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1 group-hover:text-blue-500 transition-colors">
          {playlist.name}
        </h3>
        {playlist.description && (
          <p className="text-white/60 text-sm line-clamp-2">
            {playlist.description}
          </p>
        )}
      </div>
    </div>
  )
}

export default PlaylistCard
