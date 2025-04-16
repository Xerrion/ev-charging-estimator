import { browser } from '$app/environment';
import { themeStore } from '$lib/state/ThemeStore';
import { calculatorStore } from '$lib/state/CalculatorStore';
import { get } from 'svelte/store';

export function load() {
  let theme = 'light'; // Default theme

  if (browser) {
    try {
      const themeState = get(themeStore);
      const calculatorState = get(calculatorStore);
      theme = themeState.current === 'system' ? themeState.system : themeState.current;
    } catch (error) {
      console.error('Failed to load data from storage:', error);
    }
  }

  return {
    theme
  };
}
