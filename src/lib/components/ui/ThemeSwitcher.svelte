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
    if (storeTheme && isInitialized) {
      theme = storeTheme;

      // Apply theme changes immediately if initialized
      if (typeof document !== 'undefined') {
        document.body.setAttribute('data-theme', theme);
      }
    }
  });

  // Apply theme changes and save to evSettings store
  $effect(() => {
    // Skip the initial theme application since we handle it in onMount
    if (!isInitialized) return;

    if (typeof document !== 'undefined') {
      // Use data-theme on body element as required by DaisyUI
      document.body.setAttribute('data-theme', theme);

      // Save theme preference to centralized store
      settingsStore.update({ theme });
    }
  });

  // Initialize theme on component mount
  onMount(() => {
    // Apply theme on mount
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-theme', theme);
    }

    // Set initialized flag to allow the effect to run on future changes
    isInitialized = true;
  });

  // Toggle between light and dark theme
  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
  }
</script>

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
