const ArchitectureDiagram = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Architecture Overview
      </h3>
      
      <div className="relative">
        {/* Placeholder for architecture diagram */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-12 border-2 border-dashed border-gray-300">
          <div className="text-center">
            <svg
              className="mx-auto h-24 w-24 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-600 mb-2 font-medium">Architecture Diagram</p>
            <p className="text-sm text-gray-500">
              Replace this placeholder with your architecture diagram
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Consider using: AWS Architecture Icons, Draw.io, or Lucidchart
            </p>
          </div>
        </div>
        
        {/* Simple text-based architecture overview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="font-semibold text-gray-900 mb-1">Cognito</div>
            <div className="text-xs text-gray-600">Authentication</div>
          </div>
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="font-semibold text-gray-900 mb-1">API Gateway</div>
            <div className="text-xs text-gray-600">REST API</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="font-semibold text-gray-900 mb-1">Lambda</div>
            <div className="text-xs text-gray-600">Serverless Functions</div>
          </div>
          <div className="text-center p-4 bg-pink-50 rounded-lg">
            <div className="font-semibold text-gray-900 mb-1">S3 + CloudFront</div>
            <div className="text-xs text-gray-600">Storage & CDN</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArchitectureDiagram
