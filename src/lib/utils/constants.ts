/**
 * Constants for the EV Charge Frequency Estimator
 */

export const INPUT_RANGES = {
  // Weekly distance in kilometers
  WEEKLY_DISTANCE: {
    MIN: 50,
    MAX: 2000,
    STEP: 10
  },

  // Battery capacity in kilowatt-hours
  BATTERY_CAPACITY: {
    MIN: 20,
    MAX: 150,
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
    MIN: 60,
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
    MIN: 70,
    MAX: 100,
    STEP: 1
  },

  // Temperature in Celsius
  TEMPERATURE: {
    MIN: -20,
    MAX: 50,
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
    MIN: 0.05,
    MAX: 100.0,
    STEP: 0.01
  }
};

// Default values for the calculator
export const DEFAULT_VALUES = {
  weeklyDistanceKm: 250,
  batteryKwh: 60,
  consumptionKwhPer100km: 16,
  usableFraction: 0.9,
  theme: 'light' as 'light' | 'dark',
  initialCharge: 20,
  targetCharge: 80,
  chargingPower: 11,
  chargingEfficiency: 90,
  temperatureC: 20, // Default to room temperature (20°C)
  phases: 3, // Default to 3-phase charging
  electricityRate: 0.15, // Default electricity rate per kWh
  peakElectricityRate: 0.25, // Default peak electricity rate per kWh
  offPeakElectricityRate: 0.1, // Default off-peak electricity rate per kWh
  chargingDuringOffPeak: 70, // Default percentage of charging during off-peak hours
  selectedCurrency: 'USD', // Default currency
  chargingType: 'AC' as 'AC' | 'DC' // Default to AC charging
};
