import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProfileProvider } from './context/ProfileContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import VideoPlayerPage from './pages/VideoPlayerPage'
import UploadPage from './pages/UploadPage'
import ProfileSelectPage from './pages/ProfileSelectPage'
import PlaylistsPage from './pages/PlaylistsPage'
import PlaylistDetailsPage from './pages/PlaylistDetailsPage'
import SearchResultsPage from './pages/SearchResultsPage'
import AuthCallback from './pages/AuthCallback'

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/profiles" element={<ProfileSelectPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/playlists/:id" element={<PlaylistDetailsPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/video/:videoId" element={<VideoPlayerPage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </Router>
      </ProfileProvider>
    </AuthProvider>
  )
}

export default App
