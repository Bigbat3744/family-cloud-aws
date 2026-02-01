/**
 * Progress Bar Component
 * 
 * A visual progress indicator for uploads
 */

const ProgressBar = ({ progress, label, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-white/80">{label}</span>
          <span className="text-sm font-semibold text-white">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-600 to-blue-500 h-full rounded-full transition-all duration-300 ease-out shadow-lg"
          style={{ width: `${progress}%` }}
        >
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
