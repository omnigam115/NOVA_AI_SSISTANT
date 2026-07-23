import apiClient from './apiClient'

/**
 * Authentication service module wrapping API calls to backend endpoints.
 */
export const authService = {
  /**
   * Authenticate user credentials and store JWT token in localStorage.
   *
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} Token object { access_token, token_type }
   */
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials)
    if (response.data?.access_token) {
      localStorage.setItem('nova_token', response.data.access_token)
    }
    return response.data
  },

  /**
   * Register a new user account.
   *
   * @param {Object} userData - { name, email, password }
   * @returns {Promise<Object>} User response object
   */
  async register(userData) {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
  },

  /**
   * Fetch details for the currently authenticated user session.
   *
   * @returns {Promise<Object>} User profile object
   */
  async getProfile() {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  /**
   * Clear JWT access token from localStorage.
   */
  logout() {
    localStorage.removeItem('nova_token')
  },
}

export default authService
