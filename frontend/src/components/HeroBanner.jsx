/**
 * Hero Banner Component
 * 
 * Netflix-style hero section with Kẹbíjọ branding
 * Features a large background image/video area with overlay text
 */

import { Link } from 'react-router-dom'

const HeroBanner = () => {
  return (
    <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-hero">
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDMuMzE0LTIuNjg2IDYtNiA2cy02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNnoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')]" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            {/* Logo/Brand */}
            <div className="mb-8">
              <h1 className="text-7xl md:text-8xl font-bold text-white mb-4 tracking-tight">
                Kẹbíjọ
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full" />
            </div>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Where family memories come together
            </p>
            <p className="text-lg text-white/80 mb-10 max-w-xl">
              Your private space to share, watch, and cherish moments with the people you love most.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-white text-primary-900 font-semibold rounded-lg hover:bg-white/90 transition-all duration-200 flex items-center justify-center gap-2 text-lg shadow-xl"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Watch Now
              </Link>
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-2 text-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  )
}

export default HeroBanner
