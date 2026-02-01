/**
 * Profile Card Component
 * 
 * Netflix-style profile card with avatar and name
 */

import { useState } from 'react'

const ProfileCard = ({ profile, onClick, isActive = false, showEdit = false, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false)

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div
      className="flex flex-col items-center cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Avatar Circle */}
      <div
        className={`
          relative w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden
          transition-all duration-300 ease-out
          ${isHovered ? 'scale-110 ring-4 ring-white' : 'scale-100'}
          ${isActive ? 'ring-4 ring-white' : ''}
        `}
        style={{
          backgroundColor: profile.color || '#0066e6',
        }}
      >
        {/* Avatar Image or Initials */}
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl md:text-5xl font-bold text-white">
              {getInitials(profile.name)}
            </span>
          </div>
        )}

        {/* Edit Button Overlay */}
        {showEdit && isHovered && (
          <div
            className="absolute inset-0 bg-black/60 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation()
              onEdit && onEdit(profile)
            }}
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
        )}

        {/* Active Indicator */}
        {isActive && (
          <div className="absolute top-2 right-2">
            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
          </div>
        )}
      </div>

      {/* Profile Name */}
      <h3
        className={`
          mt-4 text-xl md:text-2xl font-medium text-white/80
          transition-colors duration-200
          ${isHovered ? 'text-white' : ''}
        `}
      >
        {profile.name}
      </h3>
    </div>
  )
}

export default ProfileCard
