// frontend/src/services/auth.js
import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/api/auth/login', {
      email,
      password
    });
    
    if (response.data.ok) {
      // Le cookie est automatiquement stocké par le navigateur (HTTP-only)
      return response.data;
    }
    
    throw new Error('Login failed');
  },
  
  async register(fullName, email, password, confirmPassword) {
    const response = await api.post('/api/auth/signup', {
      full_name: fullName,
      email,
      password,
      confirm_password: confirmPassword
    });
    
    if (response.data.ok) {
      return response.data;
    }
    
    throw new Error('Registration failed');
  },
  
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  
  // PAS besoin de getCurrentUser - on utilise juste les cookies
};