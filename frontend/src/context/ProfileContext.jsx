/**
 * Profile Context
 * 
 * Manages active user profile and profile switching
 */

import { createContext, useContext, useState, useEffect } from 'react'

const ProfileContext = createContext(null)

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

const PROFILES_STORAGE_KEY = 'kebijo_profiles'
const ACTIVE_PROFILE_KEY = 'kebijo_active_profile'

// Default family profiles
const DEFAULT_PROFILES = [
  {
    id: '1',
    name: 'Dad',
    avatar: null,
    color: '#0066e6', // Blue
    isChild: false,
  },
  {
    id: '2',
    name: 'Mum',
    avatar: null,
    color: '#564d4d', // Warm gray
    isChild: false,
  },
  {
    id: '3',
    name: 'Tobi',
    avatar: null,
    color: '#0071eb', // Blue
    isChild: true,
  },
  {
    id: '4',
    name: 'Grandma',
    avatar: null,
    color: '#003d80', // Deep blue
    isChild: false,
  },
]

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([])
  const [activeProfile, setActiveProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load profiles from localStorage on mount
  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = () => {
    try {
      const storedProfiles = localStorage.getItem(PROFILES_STORAGE_KEY)
      const storedActive = localStorage.getItem(ACTIVE_PROFILE_KEY)

      if (storedProfiles) {
        const parsedProfiles = JSON.parse(storedProfiles)
        setProfiles(parsedProfiles)
      } else {
        // Initialize with default profiles
        setProfiles(DEFAULT_PROFILES)
        saveProfiles(DEFAULT_PROFILES)
      }

      if (storedActive) {
        const parsedActive = JSON.parse(storedActive)
        setActiveProfile(parsedActive)
      }
    } catch (error) {
      console.error('Error loading profiles:', error)
      setProfiles(DEFAULT_PROFILES)
    } finally {
      setLoading(false)
    }
  }

  const saveProfiles = (profilesToSave) => {
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profilesToSave))
    } catch (error) {
      console.error('Error saving profiles:', error)
    }
  }

  const selectProfile = (profile) => {
    try {
      setActiveProfile(profile)
      localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(profile))
    } catch (error) {
      console.error('Error selecting profile:', error)
    }
  }

  const switchProfile = () => {
    setActiveProfile(null)
    localStorage.removeItem(ACTIVE_PROFILE_KEY)
    navigate('/profiles')
  }

  const addProfile = (profileData) => {
    const newProfile = {
      id: Date.now().toString(),
      ...profileData,
      avatar: null,
    }
    const updatedProfiles = [...profiles, newProfile]
    setProfiles(updatedProfiles)
    saveProfiles(updatedProfiles)
    return newProfile
  }

  const updateProfile = (profileId, updates) => {
    const updatedProfiles = profiles.map((p) =>
      p.id === profileId ? { ...p, ...updates } : p
    )
    setProfiles(updatedProfiles)
    saveProfiles(updatedProfiles)

    // Update active profile if it's the one being updated
    if (activeProfile?.id === profileId) {
      const updatedActive = { ...activeProfile, ...updates }
      setActiveProfile(updatedActive)
      localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(updatedActive))
    }
  }

  const deleteProfile = (profileId) => {
    const updatedProfiles = profiles.filter((p) => p.id !== profileId)
    setProfiles(updatedProfiles)
    saveProfiles(updatedProfiles)

    // Clear active profile if it was deleted
    if (activeProfile?.id === profileId) {
      setActiveProfile(null)
      localStorage.removeItem(ACTIVE_PROFILE_KEY)
    }
  }

  const value = {
    profiles,
    activeProfile,
    loading,
    selectProfile,
    switchProfile,
    addProfile,
    updateProfile,
    deleteProfile,
  }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}
