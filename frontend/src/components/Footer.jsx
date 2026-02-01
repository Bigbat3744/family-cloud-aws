const Footer = () => {
  return (
    <footer className="bg-black/80 border-t border-white/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">K</span>
              </span>
              Kẹbíjọ
            </h3>
            <p className="text-sm text-white/60">
              Where family memories come together. Your private space to share, watch, and cherish moments with the people you love most.
            </p>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-white/60">
                A private platform just for your family
              </li>
              <li className="text-white/60">
                Share memories securely
              </li>
              <li className="text-white/60">
                Watch videos together
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Privacy</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Your data is private and secure</li>
              <li>Only family members have access</li>
              <li>Your memories stay yours</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Kẹbíjọ. Made with ❤️ for families.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
