// frontend/src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { authService } from '../services/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // On ne vérifie PAS l'authentification au chargement
  // Le backend va renvoyer 401 si les cookies ne sont pas valides
  // et notre interceptor gérera la redirection

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      // Stocker l'utilisateur dans le state
      setUser(data.user);
      return data;
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, email, password, confirmPassword) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(fullName, email, password, confirmPassword);
      setUser(data.user);
      return data;
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setError(null);
    }
  };

  return { 
    user, 
    loading, 
    error,
    login, 
    register, 
    logout
  };
}