<script lang="ts">
  import SunIcon from '$lib/assets/icons/sun.svg?raw';
  import MoonIcon from '$lib/assets/icons/moon.svg?raw';
  import { themeStore, effectiveTheme } from '$lib/state/ThemeStore';
</script>

<label class="flex cursor-pointer gap-2">
  {@html SunIcon}
  <input
    type="checkbox"
    class="toggle theme-controller"
    checked={$effectiveTheme === 'dark'}
    onclick={() => themeStore.toggleTheme()}
    aria-label={$effectiveTheme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
  />
  {@html MoonIcon}
</label>
