/**
 * Landing Page - Netflix-style Homepage
 * 
 * Features a hero banner and category rows
 */

import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroBanner from '../components/HeroBanner'
import CategoryRow from '../components/CategoryRow'
import SearchBar from '../components/SearchBar'
import { fetchVideos } from '../utils/api'
import { getCategories, getCategoryData } from '../utils/search'
import { parseTokensFromHash, saveTokens } from '../utils/auth'
import { useAuth } from '../context/AuthContext'

const LandingPage = () => {
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const categories = getCategories()
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()

  // Check for Cognito callback tokens in hash (when redirect URI is base URL)
  useEffect(() => {
    const hash = location.hash
    if (hash && hash.includes('id_token')) {
      // Handle Cognito callback at root path
      const tokens = parseTokensFromHash(hash)
      if (tokens && tokens.idToken && tokens.accessToken) {
        saveTokens(tokens.idToken, tokens.accessToken)
        login(tokens.idToken, tokens.accessToken)
        window.history.replaceState(null, '', window.location.pathname)
        navigate('/profiles', { replace: true })
      }
    }
  }, [location.hash, navigate, login])

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      setIsLoading(true)
      const videoList = await fetchVideos()
      setVideos(videoList)
    } catch (error) {
      console.error('Error loading videos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero Banner */}
      <HeroBanner />

      {/* Category Rows */}
      <div className="relative -mt-32 z-10">
        {isLoading ? (
          <div className="px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <p className="text-white/80">Loading videos...</p>
            </div>
          </div>
        ) : (
          <div className="py-8">
            {categories.map((category) => {
              const categoryData = getCategoryData(category, videos)
              if (categoryData.videos.length === 0) return null
              
              return (
                <CategoryRow
                  key={category}
                  title={category}
                  videos={categoryData.videos}
                />
              )
            })}

            {/* Empty State */}
            {categories.every((category) => {
              const categoryData = getCategoryData(category, videos)
              return categoryData.videos.length === 0
            }) && (
              <div className="px-4 sm:px-6 lg:px-8 py-20">
                <div className="max-w-2xl mx-auto text-center">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Welcome to Kẹbíjọ
                  </h2>
                  <p className="text-xl text-white/80">
                    Your private space to share, watch, and cherish family memories
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default LandingPage
