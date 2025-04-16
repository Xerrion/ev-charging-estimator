import { browser } from '$app/environment';
import type { CalculatorData, ConsentData, ThemeState } from '$lib/types';

/**
 * Storage options for configuring storage behavior
 */
export interface StorageOptions {
  storage?: 'local' | 'session'; // Which storage to use
  parser?: <T>(value: string) => T; // Custom parser for the stored value
  serializer?: (value: StorageValue) => string; // Custom serializer for the value to store
}

/**
 * Storage value can be any JSON-serializable value
 */
export type StorageValue = string | number | boolean | null | undefined | object;

/**
 * Storage keys used by the application
 */
export const STORAGE_KEYS = {
  CALCULATOR: 'calculator-data',
  CONSENT: 'consent-data',
  THEME: 'theme'
} as const;

/**
 * Default storage options
 */
const DEFAULT_OPTIONS: StorageOptions = {
  storage: 'local',
  parser: JSON.parse,
  serializer: JSON.stringify
};

/**
 * Gets a storage object based on the given type
 */
export function getStorage(type: 'local' | 'session' = 'local'): globalThis.Storage {
  if (!browser) {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    };
  }
  return type === 'local' ? localStorage : sessionStorage;
}

/**
 * Gets a value from storage
 */
export function getValue<T = StorageValue>(key: string, options: StorageOptions = DEFAULT_OPTIONS): T | null {
  const storage = getStorage(options.storage);
  const value = storage.getItem(key);

  if (value === null) return null;

  try {
    const parser = options.parser || DEFAULT_OPTIONS.parser!;
    return parser(value);
  } catch (error) {
    console.error(`Error parsing storage value for key "${key}":`, error);
    return null;
  }
}

/**
 * Sets a value in storage
 */
export function setValue(key: string, value: StorageValue, options: StorageOptions = DEFAULT_OPTIONS): void {
  const storage = getStorage(options.storage);

  try {
    const serializer = options.serializer || DEFAULT_OPTIONS.serializer!;
    storage.setItem(key, serializer(value));
  } catch (error) {
    console.error(`Error setting storage value for key "${key}":`, error);
  }
}

export interface TypedStorage<T> {
  get: () => T | null;
  set: (value: T) => void;
  remove: () => void;
  has: () => boolean;
}

function createStorage<T>(key: string): TypedStorage<T> {
  return {
    get: () => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch {
        return null;
      }
    },
    set: (value: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Failed to save to localStorage:`, error);
      }
    },
    remove: () => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Failed to remove from localStorage:`, error);
      }
    },
    has: () => {
      try {
        return localStorage.getItem(key) !== null;
      } catch {
        return false;
      }
    }
  };
}

// Type-safe storage for calculator data
export const calculatorStorage = createStorage<CalculatorData>(STORAGE_KEYS.CALCULATOR);

// Type-safe storage for theme
export const themeStorage = createStorage<ThemeState>(STORAGE_KEYS.THEME);

// Type-safe storage for consent data
export const consentStorage = createStorage<ConsentData>(STORAGE_KEYS.CONSENT);
