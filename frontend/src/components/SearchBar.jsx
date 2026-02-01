/**
 * Search Bar Component
 * 
 * Netflix-style search bar with expandable input
 */

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({ onSearch, placeholder = 'Search videos...' }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      onSearch && onSearch(query.trim())
    }
  }

  const handleFocus = () => {
    setIsExpanded(true)
  }

  const handleBlur = () => {
    // Delay blur to allow click events
    setTimeout(() => {
      if (!query.trim()) {
        setIsExpanded(false)
      }
    }, 200)
  }

  const handleClear = () => {
    setQuery('')
    setIsExpanded(false)
    inputRef.current?.blur()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        relative transition-all duration-300 ease-out
        ${isExpanded ? 'w-full max-w-2xl' : 'w-12'}
      `}
      onFocus={handleFocus}
    >
      <div className="relative flex items-center">
        {/* Search Icon */}
        <button
          type="button"
          onClick={() => {
            setIsExpanded(true)
            inputRef.current?.focus()
          }}
          className={`
            absolute left-3 z-10 p-2 text-white/60 hover:text-white transition-colors
            ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`
            w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full
            px-12 py-2.5 text-white placeholder-white/60
            focus:outline-none focus:border-white/40 focus:bg-white/15
            transition-all duration-300
            ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
        />

        {/* Clear Button */}
        {isExpanded && query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 z-10 p-1 text-white/60 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Search/Submit Button */}
        {isExpanded && (
          <button
            type="submit"
            className="absolute right-2 z-10 p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  )
}

export default SearchBar
