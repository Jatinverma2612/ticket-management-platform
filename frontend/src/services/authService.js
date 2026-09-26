import api from './api';

export const authService = {
  /**
   * Log in user with email and password
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Register a new user
   */
  async register(name, email, password) {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  /**
   * Fetch current authenticated user profile
   */
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
