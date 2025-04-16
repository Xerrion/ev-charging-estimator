import { browser } from '$app/environment';
import { themeStore } from '$lib/state/ThemeStore';
import { calculatorStore } from '$lib/state/CalculatorStore';
import { get } from 'svelte/store';

export function load() {
  let theme = 'light'; // Default theme

  if (browser) {
    try {
      const themeState = get(themeStore);
      theme =
        themeState.current === 'system'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          : themeState.current;
    } catch (error) {
      console.error('Failed to load theme from storage:', error);
    }
  }

  return {
    theme
  };
}
