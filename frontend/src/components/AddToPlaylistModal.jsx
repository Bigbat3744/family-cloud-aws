/**
 * Add to Playlist Modal Component
 * 
 * Modal for adding a video to playlists
 */

import { useState, useEffect } from 'react'
import Modal from './ui/Modal'
import Button from './ui/Button'
import { getPlaylists, addVideoToPlaylist, removeVideoFromPlaylist } from '../utils/playlists'

const AddToPlaylistModal = ({ isOpen, onClose, videoId, onUpdate }) => {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadPlaylists()
    }
  }, [isOpen, videoId])

  const loadPlaylists = () => {
    const allPlaylists = getPlaylists()
    setPlaylists(allPlaylists)
    setLoading(false)
  }

  const handleTogglePlaylist = (playlistId) => {
    const playlist = playlists.find((p) => p.id === playlistId)
    if (!playlist) return

    const isInPlaylist = playlist.videoIds?.includes(videoId)

    if (isInPlaylist) {
      removeVideoFromPlaylist(playlistId, videoId)
    } else {
      addVideoToPlaylist(playlistId, videoId)
    }

    // Reload playlists
    loadPlaylists()
    onUpdate && onUpdate()
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Header>
        <h2 className="text-2xl font-bold text-gray-900">Add to Playlist</h2>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : playlists.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No playlists yet</p>
            <p className="text-sm text-gray-500">Create a playlist first to add videos</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {playlists.map((playlist) => {
              const isInPlaylist = playlist.videoIds?.includes(videoId)
              
              return (
                <button
                  key={playlist.id}
                  onClick={() => handleTogglePlaylist(playlist.id)}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg border transition-all
                    ${isInPlaylist
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{playlist.name}</h3>
                      {playlist.description && (
                        <p className="text-sm text-gray-600 mt-1">{playlist.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {playlist.videoCount || 0} videos
                      </p>
                    </div>
                    <div className="ml-4">
                      {isInPlaylist ? (
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded" />
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" fullWidth onClick={onClose}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddToPlaylistModal
