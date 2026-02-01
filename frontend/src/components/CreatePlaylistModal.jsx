/**
 * Create Playlist Modal Component
 * 
 * Modal for creating new playlists
 */

import { useState } from 'react'
import Modal from './ui/Modal'
import Input from './ui/Input'
import Button from './ui/Button'

const CreatePlaylistModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Please enter a playlist name')
      return
    }

    if (formData.name.length > 50) {
      setError('Playlist name must be 50 characters or less')
      return
    }

    onCreate(formData)
    setFormData({ name: '', description: '' })
    setError('')
    onClose()
  }

  const handleClose = () => {
    setFormData({ name: '', description: '' })
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <Modal.Header>
        <h2 className="text-2xl font-bold text-gray-900">Create Playlist</h2>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <Input
            label="Playlist Name"
            type="text"
            placeholder="e.g., Christmas 2024, Baby's First Year"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={error}
            required
            autoFocus
          />

          <div className="mt-4">
            <Input
              label="Description (Optional)"
              type="textarea"
              placeholder="Add a description for this playlist"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Create Playlist
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CreatePlaylistModal
