/**
 * Constants for the EV Charge Frequency Estimator
 */

import type { ThemeState } from '$lib/types/theme';
import type { ConsentData } from '$lib/types/consent';
import type { CalculatorData } from '$lib/types/calculator';

export const DEFAULT_CALCULATOR: CalculatorData = {
  batteryCapacity: 60,
  chargingEfficiency: 85,
  electricityRate: 0.34,
  currency: 'USD',
  weeklyDistanceKm: 250,
  batteryKwh: 60,
  consumptionKwhPer100km: 16,
  usableFraction: 0.9,
  initialCharge: 20,
  targetCharge: 80,
  chargingPower: 11,
  temperatureC: 20,
  phases: 3,
  peakElectricityRate: 0.25,
  offPeakElectricityRate: 0.1,
  chargingDuringOffPeak: 70,
  chargingType: 'AC' as const
};

export const DEFAULT_THEME: ThemeState = {
  current: 'system',
  system: 'light'
};

export const DEFAULT_CONSENT: ConsentData = {
  accepted: false,
  lastUpdated: new Date().toISOString()
};

// Storage keys for different data categories
export const STORAGE_KEYS = {
  CALCULATOR: 'calculator-data',
  THEME: 'theme',
  CONSENT: 'consent'
} as const;

export const INPUT_RANGES = {
  // Weekly distance in kilometers
  WEEKLY_DISTANCE: {
    MIN: 50,
    MAX: 1000,
    STEP: 10
  },

  // Battery capacity in kilowatt-hours
  BATTERY_CAPACITY: {
    MIN: 20,
    MAX: 200,
    STEP: 1
  },

  // Energy consumption in kilowatt-hours per 100 kilometers
  ENERGY_CONSUMPTION: {
    MIN: 10,
    MAX: 30,
    STEP: 0.1
  },

  // Usable battery percentage
  USABLE_BATTERY: {
    MIN: 0,
    MAX: 100,
    STEP: 1
  },

  // Battery charge percentage
  BATTERY_CHARGE: {
    MIN: 0,
    MAX: 100,
    STEP: 1
  },

  // Charging power in kilowatts
  CHARGING_POWER: {
    MIN: 3.7,
    MAX: 350,
    STEP: 0.1
  },

  // Charging efficiency in percentage
  CHARGING_EFFICIENCY: {
    MIN: 50,
    MAX: 100,
    STEP: 1
  },

  // Temperature in Celsius
  TEMPERATURE: {
    MIN: -20,
    MAX: 40,
    STEP: 1
  },

  // Charging phases
  PHASES: {
    MIN: 1,
    MAX: 3,
    STEP: 1
  },

  // Electricity rate in currency units per kWh
  ELECTRICITY_RATE: {
    MIN: 0.01,
    MAX: 1,
    STEP: 0.01
  },

  // Battery capacity in kilowatt-hours
  BATTERY_KWH: {
    MIN: 20,
    MAX: 200,
    STEP: 1
  },

  // Usable fraction of the battery
  USABLE_FRACTION: {
    MIN: 0.5,
    MAX: 1,
    STEP: 0.01
  },

  // Charge level of the battery
  CHARGE_LEVEL: {
    MIN: 0,
    MAX: 100,
    STEP: 1
  },

  // Consumption in kilowatt-hours per 100 kilometers
  CONSUMPTION: {
    MIN: 10,
    MAX: 30,
    STEP: 0.1
  }
};

// Default values by category
export const DEFAULT_VALUES = {
  CALCULATOR: DEFAULT_CALCULATOR,
  THEME: DEFAULT_THEME,
  CONSENT: DEFAULT_CONSENT
};
