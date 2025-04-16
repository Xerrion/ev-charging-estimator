import { browser } from '$app/environment';
import { DEFAULT_VALUES } from '$lib/utils/constants';
import { calculatorStorage } from '$lib/utils/storage';

export function load() {
  // Initialize with default values
  let calculatorData = { ...DEFAULT_VALUES };

  // Only access storage in the browser
  if (browser) {
    try {
      const storedData = calculatorStorage.get();
      if (storedData) {
        calculatorData = {
          ...calculatorData,
          ...storedData
        };
      }
    } catch (error) {
      console.error('Failed to load calculator data from storage:', error);
    }
  }

  return {
    calculatorData
  };
} 