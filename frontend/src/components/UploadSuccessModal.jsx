/**
 * Upload Success Modal Component
 * 
 * Displays success message after upload completion
 */

import { useNavigate } from 'react-router-dom'
import Button from './ui/Button'

const UploadSuccessModal = ({ isOpen, onClose, videoTitle }) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleGoToDashboard = () => {
    navigate('/dashboard')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-8 transform transition-all">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upload Successful!
          </h2>
          {videoTitle && (
            <p className="text-gray-600 mb-4">
              <span className="font-semibold">{videoTitle}</span> has been uploaded successfully.
            </p>
          )}
          <p className="text-gray-600">
            Your video is now available in your library.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            fullWidth
            onClick={handleGoToDashboard}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
          >
            Upload Another
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UploadSuccessModal
