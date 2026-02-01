const VideoMetadata = ({ video }) => {
  if (!video) return null

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatSize = (bytes) => {
    if (!bytes) return 'N/A'
    const mb = bytes / (1024 * 1024)
    if (mb < 1) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }
    if (mb < 1024) {
      return `${mb.toFixed(1)} MB`
    }
    return `${(mb / 1024).toFixed(2)} GB`
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Video Details</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Title</h3>
          <p className="text-lg text-gray-900">{video.title}</p>
        </div>

        {video.uploadedAt && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Upload Date</h3>
            <div className="flex items-center gap-2 text-gray-900">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formatDate(video.uploadedAt)}</span>
            </div>
          </div>
        )}

        {video.duration && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
            <div className="flex items-center gap-2 text-gray-900">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{video.duration}</span>
            </div>
          </div>
        )}

        {video.size && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">File Size</h3>
            <div className="flex items-center gap-2 text-gray-900">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                />
              </svg>
              <span>{formatSize(video.size)}</span>
            </div>
          </div>
        )}

        {video.id && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Video ID</h3>
            <p className="text-sm font-mono text-gray-600 bg-gray-50 px-3 py-2 rounded">
              {video.id}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoMetadata
