/**
 * Upload Page - Video Upload Interface
 * 
 * Allows users to upload videos to S3 using presigned URLs
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import UploadForm from '../components/UploadForm'
import ProgressBar from '../components/ProgressBar'
import UploadSuccessModal from '../components/UploadSuccessModal'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'
import { getPresignedUploadUrl, uploadToS3, saveMetadataToBackend } from '../utils/api'
import Button from '../components/ui/Button'

const UploadPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { activeProfile, loading: profileLoading } = useProfile()
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [uploadedVideoTitle, setUploadedVideoTitle] = useState('')

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      navigate('/login')
      return
    }

    // Redirect if no profile selected
    if (!profileLoading && isAuthenticated && !activeProfile) {
      navigate('/profiles')
      return
    }
  }, [authLoading, profileLoading, isAuthenticated, activeProfile, navigate])

  const handleFileSelect = (file) => {
    if (!file) {
      setSelectedFile(null)
      setError(null)
      return
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file')
      return
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024 // 500MB
    if (file.size > maxSize) {
      setError('File size must be less than 500MB')
      return
    }

    setSelectedFile(file)
    setError(null)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload')
      return
    }

    try {
      setIsUploading(true)
      setError(null)
      setUploadProgress(0)

      // Step 1: Initiate upload and get presigned URL + videoId
      const uploadInit = await getPresignedUploadUrl(selectedFile.name, selectedFile.type)
      
      if (!uploadInit || !uploadInit.uploadUrl) {
        throw new Error('Failed to get upload URL')
      }

      const { uploadUrl, videoId } = uploadInit

      // Step 2: Upload to S3 with progress tracking
      await uploadToS3(selectedFile, uploadUrl, (progress) => {
        setUploadProgress(progress)
      })

      // Step 3: Save metadata to backend (using videoId from initiateUpload)
      const metadata = {
        title: selectedFile.name.replace(/\.[^/.]+$/, ''), // Remove extension
        filename: selectedFile.name,
        size: selectedFile.size,
        contentType: selectedFile.type,
        duration: '0:00', // Would be extracted from video in production
      }

      const savedVideo = await saveMetadataToBackend(metadata, videoId)
      
      setUploadedVideoTitle(savedVideo.title || metadata.title)
      setShowSuccessModal(true)
      setIsUploading(false)
      setUploadProgress(100)

    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload video. Please try again.')
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if redirecting
  if (!isAuthenticated || !activeProfile) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Upload Video
          </h1>
          <p className="text-white/60 text-lg">
            Share your family memories with Kẹbíjọ
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-6">
          <UploadForm
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            isUploading={isUploading}
          />

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-400"
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
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {isUploading && (
            <div className="mt-6">
              <ProgressBar
                progress={uploadProgress}
                label="Uploading video..."
              />
            </div>
          )}

          {/* Upload Button */}
          {selectedFile && !isUploading && (
            <div className="mt-6 flex gap-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleUpload}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Upload Video
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">Upload Guidelines</h3>
          <ul className="space-y-2 text-white/60 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-gold-400 mt-1">•</span>
              <span>Supported formats: MP4, MOV, AVI, WebM, and other common video formats</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-400 mt-1">•</span>
              <span>Maximum file size: 500MB</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-400 mt-1">•</span>
              <span>Videos are processed automatically after upload</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-400 mt-1">•</span>
              <span>You can edit the title and details after uploading</span>
            </li>
          </ul>
        </div>
      </div>

      <Footer />

      {/* Success Modal */}
      <UploadSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          setSelectedFile(null)
          setUploadProgress(0)
        }}
        videoTitle={uploadedVideoTitle}
      />
    </div>
  )
}

export default UploadPage
