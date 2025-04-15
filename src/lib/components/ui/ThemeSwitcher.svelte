<script lang="ts">
  import { onMount } from 'svelte';
  import SunIcon from '$lib/assets/icons/sun.svg?raw';
  import MoonIcon from '$lib/assets/icons/moon.svg?raw';
  import { settingsStore, theme as themeStore } from '$lib/state/SettingsStore';

  // Accept currentTheme as a prop
  let { currentTheme } = $props<{ currentTheme?: 'light' | 'dark' }>();

  // Initialize theme with prop value or from store
  let theme = $state<'light' | 'dark'>(currentTheme || 'light');
  let isInitialized = $state(false);

  // Use the prop value if provided
  $effect(() => {
    if (currentTheme && !isInitialized) {
      theme = currentTheme;
    }
  });

  // Subscribe to theme changes from the store
  themeStore.subscribe((storeTheme) => {
    if (storeTheme && (isInitialized || typeof document === 'undefined')) {
      theme = storeTheme;

      // Apply theme changes immediately if initialized and in browser
      if (typeof document !== 'undefined') {
        applyThemeToDocument(theme);
      }
    }
  });

  // Helper function to apply theme consistently
  function applyThemeToDocument(currentTheme: 'light' | 'dark') {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', currentTheme);
      document.body.setAttribute('data-theme', currentTheme);
    }
  }

  // Apply theme changes and save to evSettings store
  $effect(() => {
    // Skip the initial theme application since we handle it in onMount
    if (!isInitialized) return;

    if (typeof document !== 'undefined') {
      // Apply theme to both document elements
      applyThemeToDocument(theme);

      // Save theme preference to centralized store
      settingsStore.update({ theme });
    }
  });

  // Initialize theme on component mount
  onMount(() => {
    // Apply theme on mount
    if (typeof document !== 'undefined') {
      applyThemeToDocument(theme);
    }

    // Set initialized flag to allow the effect to run on future changes
    isInitialized = true;
  });

  // Toggle between light and dark theme
  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
  }
</script>

<svelte:head>
  <script>
    // Check localStorage for theme preference and apply immediately to prevent flicker
    try {
      const storedData = localStorage.getItem('ev-calculator-data');
      let theme = 'light';

      if (storedData) {
        const data = JSON.parse(storedData);
        // Check if theme exists and is valid
        if (data && (data.theme === 'dark' || data.theme === 'light')) {
          theme = data.theme;
        }
      } else {
        // No stored preference, check system preference
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      // Apply theme to both html and body elements to avoid flicker
      document.documentElement.setAttribute('data-theme', theme);

      // Style element to avoid FOUC (Flash of Unstyled Content)
      const style = document.createElement('style');
      style.textContent = `body { opacity: 0; }`;
      document.head.appendChild(style);

      // Remove the style when DOM is ready
      window.addEventListener('DOMContentLoaded', () => {
        document.body.setAttribute('data-theme', theme);
        document.head.removeChild(style);
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.2s ease-in-out';
      });
    } catch (error) {
      console.error('Failed to apply theme from localStorage:', error);
    }
  </script>
</svelte:head>

<label class="flex cursor-pointer gap-2">
  {@html SunIcon}
  <input
    type="checkbox"
    class="toggle theme-controller"
    checked={theme === 'dark'}
    onclick={toggleTheme}
    aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
  />
  {@html MoonIcon}
</label>
