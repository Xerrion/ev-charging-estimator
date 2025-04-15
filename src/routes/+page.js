import { browser } from '$app/environment';
import { DEFAULT_VALUES } from '$lib/utils/constants';

export function load() {
  // Initialize with default values
  let calculatorData = { ...DEFAULT_VALUES };

  // Only access localStorage in the browser
  if (browser) {
    try {
      const storedData = localStorage.getItem('ev-calculator-data');
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Use stored data if valid, otherwise fallback to defaults
        if (parsedData && typeof parsedData === 'object') {
          calculatorData = {
            ...calculatorData, // Keep defaults as fallback
            ...parsedData // Override with stored values
          };
        }
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
  }

  return {
    calculatorData
  };
} 