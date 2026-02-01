/**
 * Profile Select Page
 * 
 * Netflix-style "Who's watching?" screen
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProfileCard from '../components/ProfileCard'
import AddProfileModal from '../components/AddProfileModal'
import { useProfile } from '../context/ProfileContext'
import { useAuth } from '../context/AuthContext'

const ProfileSelectPage = () => {
  const navigate = useNavigate()
  const { profiles, activeProfile, selectProfile, addProfile, loading } = useProfile()
  const { isAuthenticated } = useAuth()
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    // If profile already selected, redirect to dashboard
    if (activeProfile) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, activeProfile, navigate])

  const handleProfileSelect = (profile) => {
    selectProfile(profile)
    navigate('/dashboard')
  }

  const handleAddProfile = (profileData) => {
    const newProfile = addProfile(profileData)
    selectProfile(newProfile)
    navigate('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-white/80">Loading profiles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-20">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Who's watching?
            </h1>
            <p className="text-xl text-white/60">
              Select a profile to continue
            </p>
          </div>

          {/* Profiles Grid */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-12">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onClick={() => handleProfileSelect(profile)}
                isActive={activeProfile?.id === profile.id}
              />
            ))}

            {/* Add Profile Card */}
            <div className="flex flex-col items-center cursor-pointer group">
              <div
                className="w-32 h-32 md:w-40 md:h-40 rounded-lg border-4 border-dashed border-white/30 flex items-center justify-center transition-all duration-300 hover:border-white/60 hover:scale-110"
                onClick={() => setShowAddModal(true)}
              >
                <svg
                  className="w-12 h-12 md:w-16 md:h-16 text-white/60 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-xl md:text-2xl font-medium text-white/60 group-hover:text-white/80 transition-colors">
                Add Profile
              </h3>
            </div>
          </div>

          {/* Manage Profiles Button */}
          {profiles.length > 0 && (
            <div className="text-center">
              <button
                onClick={() => {
                  // Navigate to profile management page (future feature)
                  console.log('Manage profiles')
                }}
                className="px-8 py-3 border-2 border-white/30 text-white font-semibold rounded hover:border-white/60 transition-colors"
              >
                Manage Profiles
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Add Profile Modal */}
      <AddProfileModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProfile}
      />
    </div>
  )
}

export default ProfileSelectPage
