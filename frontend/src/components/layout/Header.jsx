import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Header Component.
 * Top navigation bar with breadcrumbs, mobile menu toggle, and user profile dropdown.
 */
function Header({ onMenuToggle }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Derive page title from route
  const pageTitle = {
    '/dashboard': 'Dashboard',
    '/chat': 'New Chat',
    '/settings': 'Settings',
  }[location.pathname] ?? 'NOVA AI'

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setDropdownOpen(false)
    logout()
    navigate('/login')
  }

  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U'

  return (
    <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80">
      {/* Left — hamburger + breadcrumb */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          aria-label="Open sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-sm">
          <span className="text-slate-500">NOVA AI</span>
          <span className="text-slate-700">/</span>
          <span className="font-semibold text-slate-200">{pageTitle}</span>
        </div>

        <span className="sm:hidden font-semibold text-slate-200 text-sm">{pageTitle}</span>
      </div>

      {/* Right — user profile dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition-all text-sm"
        >
          {/* Avatar */}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shadow shadow-indigo-500/20">
            {avatarLetter}
          </div>
          <span className="hidden sm:block text-slate-300 font-medium text-xs max-w-[120px] truncate">
            {user?.name ?? 'User'}
          </span>
          <svg
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-slate-950/50 overflow-hidden z-50">
            {/* Profile info */}
            <div className="px-4 py-3 border-b border-slate-800">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>

            <div className="p-1">
              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-slate-100 transition-colors"
              >
                <span>⚙️</span>
                <span>Settings</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
