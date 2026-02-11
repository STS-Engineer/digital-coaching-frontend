// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ESSENTIEL pour les cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Compteur pour éviter les redirections multiples
let redirectCount = 0;
const MAX_REDIRECTS = 3;

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Limiter le nombre de redirections
      if (redirectCount < MAX_REDIRECTS && !window.location.pathname.includes('/login')) {
        redirectCount++;
        
        console.log('Authentication required, redirecting to login...');
        
        // Rediriger vers la page de login
        window.location.href = '/login';
      }
    }
    
    // Pour toutes les erreurs, on les propage
    return Promise.reject(error);
  }
);

// Réinitialiser le compteur sur les requêtes réussies
api.interceptors.request.use(
  (config) => {
    // Réinitialiser le compteur pour chaque nouvelle requête
    if (!config.url.includes('/login') && !config.url.includes('/auth/logout')) {
      redirectCount = 0;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;