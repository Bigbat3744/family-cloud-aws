/**
 * Add Profile Modal Component
 * 
 * Modal for adding new family profiles
 */

import { useState } from 'react'
import Modal from './ui/Modal'
import Input from './ui/Input'
import Button from './ui/Button'

const AddProfileModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#0066e6',
    isChild: false,
  })
  const [error, setError] = useState('')

  const colors = [
    '#0066e6', // Blue
    '#564d4d', // Warm gray
    '#0071eb', // Light blue
    '#003d80', // Deep blue
    '#ff6b00', // Orange
    '#00d4ff', // Cyan
    '#1ce783', // Green
    '#ffa500', // Gold
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Please enter a name')
      return
    }

    if (formData.name.length > 20) {
      setError('Name must be 20 characters or less')
      return
    }

    onAdd(formData)
    setFormData({ name: '', color: '#0066e6', isChild: false })
    onClose()
  }

  const handleClose = () => {
    setFormData({ name: '', color: '#0066e6', isChild: false })
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <Modal.Header>
        <h2 className="text-2xl font-bold text-gray-900">Add Profile</h2>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <Input
            label="Profile Name"
            type="text"
            placeholder="Enter name (e.g., Dad, Mum, Tobi)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={error}
            required
            autoFocus
          />

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`
                    w-12 h-12 rounded-lg transition-all duration-200
                    ${formData.color === color
                      ? 'ring-4 ring-blue-500 ring-offset-2 scale-110'
                      : 'hover:scale-105'
                    }
                  `}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isChild}
                onChange={(e) => setFormData({ ...formData, isChild: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Kids profile (restricted content)</span>
            </label>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Add Profile
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddProfileModal
