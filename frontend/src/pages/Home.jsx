import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import apiClient from '../services/apiClient'

/**
 * Protected Home Dashboard page.
 * Displays user profile information and backend system health metrics.
 */
function Home() {
  const { user, logout } = useAuth()
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    apiClient
      .get('/status')
      .then((response) => {
        if (isMounted) setStatus(response.data)
      })
      .catch((err) => {
        if (isMounted) setError(err.message)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-4">
      <div className="max-w-md w-full p-8 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-100">NOVA AI Assistant</h1>
            <p className="text-xs text-indigo-400 font-medium">Sprint 1B — Authenticated Session</p>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 hover:text-red-300 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* User Session Profile Box */}
        {user && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Account
            </h2>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/30">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Backend System Status Metrics */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            System Connectivity
          </h2>

          {error && (
            <p className="text-red-400 text-xs">Backend unreachable: {error}</p>
          )}

          {!error && !status && (
            <p className="text-slate-400 text-xs">Connecting to API service…</p>
          )}

          {status && (
            <dl className="text-xs space-y-2">
              <div className="flex justify-between">
                <dt className="text-slate-400">Service</dt>
                <dd className="font-mono text-slate-200">{status.service}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Environment</dt>
                <dd className="font-mono text-slate-200">{status.environment}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Database Engine</dt>
                <dd className="font-mono text-emerald-400 font-semibold">{status.database}</dd>
              </div>
            </dl>
          )}
        </div>
      </div>
    </main>
  )
}

export default Home
