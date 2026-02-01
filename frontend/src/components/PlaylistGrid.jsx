/**
 * Playlist Grid Component
 * 
 * Grid layout for displaying playlists
 */

import PlaylistCard from './PlaylistCard'

const PlaylistGrid = ({ playlists = [], videos = [] }) => {
  if (!playlists || playlists.length === 0) {
    return (
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No playlists yet</h3>
        <p className="text-white/60">Create your first playlist to organize your family videos</p>
      </div>
    )
  }

  // Create a map of video IDs to video objects for quick lookup
  const videoMap = videos.reduce((acc, video) => {
    acc[video.id] = video
    return acc
  }, {})

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {playlists.map((playlist) => {
        // Get videos for this playlist
        const playlistVideos = playlist.videoIds
          ?.map((id) => videoMap[id])
          .filter(Boolean) || []
        
        return (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            videos={playlistVideos}
          />
        )
      })}
    </div>
  )
}

export default PlaylistGrid
