import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Sidebar Component.
 * Responsive sidebar supporting desktop persistent display and mobile sliding drawer overlay.
 */
function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const { logout } = useAuth()

  // Dummy chat history items for UI placeholder
  const dummyHistory = [
    { id: '1', title: 'API Architecture Refactor' },
    { id: '2', title: 'Docker Compose Setup' },
    { id: '3', title: 'Database Migration Plan' },
    { id: '4', title: 'JWT Authentication Flow' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & Logo */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-3 group" onClick={onClose}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                N
              </div>
              <div>
                <span className="font-bold text-slate-100 text-base tracking-tight block">
                  NOVA AI
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-400 block">
                  Operating System
                </span>
              </div>
            </Link>
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* New Chat Action Button */}
          <button
            onClick={() => alert('New Chat interface will be connected in Sprint 2B.')}
            className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98]"
          >
            <span className="text-base font-bold">+</span>
            <span>New Chat</span>
          </button>

          {/* Primary Navigation */}
          <nav className="space-y-1 pt-2">
            <Link
              to="/dashboard"
              onClick={onClose}
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>📊</span>
              <span>Dashboard</span>
            </Link>

            <Link
              to="/settings"
              onClick={onClose}
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                isActive('/settings')
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>⚙️</span>
              <span>Settings</span>
            </Link>
          </nav>

          {/* Chat History Section Placeholder */}
          <div className="pt-3 border-t border-slate-800/60">
            <h3 className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Recent Conversations
            </h3>
            <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1 text-slate-400">
              {dummyHistory.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => alert(`Opening placeholder chat: ${chat.title}`)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-800/60 hover:text-slate-200 transition-colors truncate block"
                >
                  💬 {chat.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer & User Session */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/30 border border-transparent hover:border-red-900/40 transition-all"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
