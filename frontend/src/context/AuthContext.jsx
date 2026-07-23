import { createContext, useContext, useEffect, useState } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

/**
 * Authentication Provider component wrapping the application to supply
 * state, user session restoration, and auth actions.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Restore authenticated session on application mount
  useEffect(() => {
    let isMounted = true

    async function checkAuthStatus() {
      const token = localStorage.getItem('nova_token')
      if (token) {
        try {
          const profile = await authService.getProfile()
          if (isMounted) {
            setUser(profile)
          }
        } catch (err) {
          authService.logout()
          if (isMounted) {
            setUser(null)
          }
        }
      }
      if (isMounted) {
        setLoading(false)
      }
    }

    checkAuthStatus()

    return () => {
      isMounted = false
    }
  }, [])

  const login = async (credentials) => {
    setError(null)
    setLoading(true)
    try {
      await authService.login(credentials)
      const profile = await authService.getProfile()
      setUser(profile)
      setLoading(false)
      return profile
    } catch (err) {
      setLoading(false)
      const message =
        err.response?.data?.detail || 'Login failed. Please check your credentials.'
      setError(message)
      throw new Error(message)
    }
  }

  const register = async (userData) => {
    setError(null)
    setLoading(true)
    try {
      const newUser = await authService.register(userData)
      // Auto-login after successful registration
      await login({ email: userData.email, password: userData.password })
      return newUser
    } catch (err) {
      setLoading(false)
      const message =
        err.response?.data?.detail || 'Registration failed. Please try again.'
      setError(message)
      throw new Error(message)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setError(null)
  }

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError: () => setError(null),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Custom hook to consume the authentication context easily.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
