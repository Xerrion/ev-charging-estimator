import { browser } from '$app/environment';

export function load() {
  let theme = 'light'; // Default theme

  if (browser) {
    try {
      const storedData = localStorage.getItem('ev-calculator-data');

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData && parsedData.theme && (parsedData.theme === 'light' || parsedData.theme === 'dark')) {
          theme = parsedData.theme;
        }
      }
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error);
    }
  }

  return {
    theme
  };
}
