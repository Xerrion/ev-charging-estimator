import { browser } from '$app/environment';
import { BaseStore, type BaseStoreOptions } from './BaseStore';
import { themeStorage, STORAGE_KEYS } from '$lib/utils/storage';
import { derived, get } from 'svelte/store';
import type { Theme, ThemeState } from '$lib/types';
import { DEFAULT_VALUES } from '$lib/utils/constants';

function validateThemeData(data: unknown): data is ThemeState {
  if (!data || typeof data !== 'object') return false;

  const d = data as Partial<ThemeState>;
  return (
    (d.current === 'light' || d.current === 'dark' || d.current === 'system') &&
    (d.system === 'light' || d.system === 'dark')
  );
}

function getSystemTheme(): 'light' | 'dark' {
  if (!browser) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

class ThemeStore extends BaseStore<ThemeState> {
  constructor() {
    const options: BaseStoreOptions<ThemeState> = {
      key: STORAGE_KEYS.THEME,
      initialValue: DEFAULT_VALUES.THEME,
      validate: validateThemeData
    };
    super(options);

    if (browser) {
      // Initialize system theme detection
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const updateSystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
        this.update((state) => ({
          ...state,
          system: e.matches ? 'dark' : 'light'
        }));
      };

      // Set initial value
      updateSystemTheme(mediaQuery);

      // Listen for changes
      mediaQuery.addEventListener('change', updateSystemTheme);

      // Subscribe to theme changes and apply them
      this.subscribe((state) => {
        const theme = state.current === 'system' ? state.system : state.current;
        requestAnimationFrame(() => {
          document.documentElement.setAttribute('data-theme', theme);
        });
      });
    }
  }

  setTheme(theme: Theme): void {
    this.update((state) => ({ ...state, current: theme }));
  }

  toggleTheme(): void {
    const state = get(this.store);
    const effectiveTheme = state.current === 'system' ? state.system : state.current;
    this.setTheme(effectiveTheme === 'light' ? 'dark' : 'light');
  }

  get effectiveTheme(): 'light' | 'dark' {
    const state = get(this.store);
    return state.current === 'system' ? state.system : state.current;
  }

  resetToDefaults(): void {
    this.reset(DEFAULT_VALUES.THEME);
  }
}

export const themeStore = new ThemeStore();

// Create a derived store for the effective theme (resolves 'system' to actual theme)
export const effectiveTheme = derived(themeStore, ($theme) => {
  return $theme.current === 'system' ? $theme.system : $theme.current;
});

// Apply theme changes using requestAnimationFrame for smoother transitions
if (browser) {
  effectiveTheme.subscribe((theme) => {
    requestAnimationFrame(() => {
      document.documentElement.setAttribute('data-theme', theme);
    });
  });
}
