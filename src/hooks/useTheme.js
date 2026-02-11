// frontend/src/hooks/useThemeSimple.js
import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('dark');

  const applyTheme = (nextTheme) => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.remove('dark', 'light');
    body.classList.remove('dark', 'light');

    root.classList.add(nextTheme);
    body.classList.add(nextTheme);
  };

  useEffect(() => {
    // Récupérer le thème depuis localStorage
    const savedThemeRaw = localStorage.getItem('theme');
    const savedTheme = savedThemeRaw === 'light' || savedThemeRaw === 'dark' ? savedThemeRaw : 'dark';
    setTheme(savedTheme);
    
    // Appliquer la classe au document
    applyTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      // Mettre à jour les classes
      applyTheme(newTheme);

      // Sauvegarder
      localStorage.setItem('theme', newTheme);

      return newTheme;
    });
  };

  return { 
    theme, 
    toggleTheme, 
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
}
