import { DEFAULT_VALUES } from '$lib/utils/constants';
import { writable, derived, get } from 'svelte/store';
import type { Writable } from 'svelte/store';

export type StorageData = {
  weeklyDistanceKm: number;
  batteryKwh: number;
  consumptionKwhPer100km: number;
  usableFraction: number;
  initialCharge: number;
  targetCharge: number;
  chargingPower: number;
  chargingEfficiency: number;
  theme: 'light' | 'dark';
  temperatureC: number;
  phases: number;
  electricityRate: number;
  peakElectricityRate: number;
  offPeakElectricityRate: number;
  chargingDuringOffPeak: number;
  selectedCurrency: string;
};

/**
 * EV Settings Store
 *
 * A centralized store for all EV calculator data with localStorage persistence
 * that loads data only once and saves only when actual changes are made.
 */

// Storage constants
const STORAGE_KEY = 'ev-calculator-data';

// State for tracking if initial data has been loaded
let isInitialized = false;

// Create the core store with default values
const createSettingsStore = () => {
  // Create the main writable store
  const store: Writable<StorageData> = writable(DEFAULT_VALUES);

  // Initial load from localStorage (happens only once)
  if (typeof window !== 'undefined' && !isInitialized) {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const validatedData = validateStoredData(parsedData);
        store.set(validatedData);
      }

      isInitialized = true;
    } catch (error) {
      console.error('Failed to load EV settings from localStorage:', error);
    }
  }

  // Return enhanced store with persistence
  return {
    subscribe: store.subscribe,

    /**
     * Update specific settings and persist to localStorage
     */
    update(partialData: Partial<StorageData>): void {
      store.update((currentData) => {
        const newData = { ...currentData, ...partialData };

        // Don't save during SSR
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
          } catch (error) {
            console.error('Failed to save EV settings to localStorage:', error);
          }
        }

        return newData;
      });
    },

    /**
     * Replace all settings with new data
     */
    set(data: StorageData): void {
      // Don't save during SSR
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
          console.error('Failed to save EV settings to localStorage:', error);
        }
      }

      store.set(data);
    },

    /**
     * Reset all settings to default values
     */
    reset(): void {
      // Don't save during SSR
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_VALUES));
        } catch (error) {
          console.error('Failed to save default EV settings to localStorage:', error);
        }
      }

      store.set(DEFAULT_VALUES);
    },

    /**
     * Check if the store has been initialized
     */
    get isInitialized(): boolean {
      return isInitialized;
    }
  };
};

/**
 * Validates and sanitizes data loaded from storage
 */
function validateStoredData(data: unknown): StorageData {
  // Start with default values
  const result = { ...DEFAULT_VALUES };

  // Validate each field with appropriate type checking
  if (typeof data === 'object' && data !== null) {
    const typedData = data as Record<string, unknown>;

    // Process all numeric fields
    const numericFields = [
      'weeklyDistanceKm',
      'batteryKwh',
      'consumptionKwhPer100km',
      'usableFraction',
      'initialCharge',
      'targetCharge',
      'chargingPower',
      'chargingEfficiency',
      'temperatureC',
      'phases',
      'electricityRate',
      'peakElectricityRate',
      'offPeakElectricityRate',
      'chargingDuringOffPeak'
    ] as const;

    // Type-safe way to iterate through the numeric fields
    for (const field of numericFields) {
      if (typeof typedData[field] === 'number' && !isNaN(typedData[field] as number)) {
        result[field] = typedData[field] as number;
      }
    }

    // Handle theme separately
    if (typedData.theme === 'dark' || typedData.theme === 'light') {
      result.theme = typedData.theme;
    }

    // Handle selected currency
    if (typeof typedData.selectedCurrency === 'string') {
      result.selectedCurrency = typedData.selectedCurrency;
    }
  }

  return result;
}

// Create and export the store
export const settingsStore = createSettingsStore();

// Derived stores for specific settings
export const batteryCapacity = derived(settingsStore, ($settings) => $settings.batteryKwh);
export const weeklyDistance = derived(settingsStore, ($settings) => $settings.weeklyDistanceKm);
export const energyConsumption = derived(settingsStore, ($settings) => $settings.consumptionKwhPer100km);
export const usableBatteryFraction = derived(settingsStore, ($settings) => $settings.usableFraction);
export const theme = derived(settingsStore, ($settings) => $settings.theme);

// Helper functions to update specific settings
export function updateBatteryCapacity(value: number): void {
  settingsStore.update({ batteryKwh: value });
}

export function getBatteryCapacity(): number {
  return get(settingsStore).batteryKwh;
}
