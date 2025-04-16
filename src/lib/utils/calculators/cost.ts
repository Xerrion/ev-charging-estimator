import { INPUT_RANGES } from '../constants';
import { getCostTips } from '../tips';
import { calculateChargingCost, calculateWeeklyCharges } from '../calculations';
import { getCurrencyOptions } from '../../data/currencies';

// Rate type options
export type RateType = 'flat' | 'variable';

/**
 * Get available currency options
 */
export const getCostCurrencyOptions = getCurrencyOptions;

/**
 * Base input fields configuration for cost calculator (common for both rate types)
 */
export const baseInputFields = [
  {
    id: 'weekly-distance',
    label: 'Weekly Distance',
    key: 'weeklyDistanceKm',
    storeKey: 'weeklyDistanceKm',
    min: INPUT_RANGES.WEEKLY_DISTANCE.MIN,
    max: INPUT_RANGES.WEEKLY_DISTANCE.MAX,
    step: INPUT_RANGES.WEEKLY_DISTANCE.STEP,
    unit: 'km',
    allowDecimals: false
  },
  {
    id: 'battery-capacity',
    label: 'Battery Capacity',
    key: 'batteryKwh',
    storeKey: 'batteryKwh',
    min: INPUT_RANGES.BATTERY_CAPACITY.MIN,
    max: INPUT_RANGES.BATTERY_CAPACITY.MAX,
    step: INPUT_RANGES.BATTERY_CAPACITY.STEP,
    unit: 'kWh',
    allowDecimals: false
  },
  {
    id: 'initial-charge',
    label: 'Initial Charge',
    key: 'initialCharge',
    storeKey: 'initialCharge',
    min: INPUT_RANGES.BATTERY_CHARGE.MIN,
    max: INPUT_RANGES.BATTERY_CHARGE.MAX,
    step: INPUT_RANGES.BATTERY_CHARGE.STEP,
    unit: '%',
    allowDecimals: false
  },
  {
    id: 'target-charge',
    label: 'Target Charge',
    key: 'targetCharge',
    storeKey: 'targetCharge',
    min: INPUT_RANGES.BATTERY_CHARGE.MIN,
    max: INPUT_RANGES.BATTERY_CHARGE.MAX,
    step: INPUT_RANGES.BATTERY_CHARGE.STEP,
    unit: '%',
    allowDecimals: false
  },
  {
    id: 'charging-efficiency',
    label: 'Charging Efficiency',
    key: 'chargingEfficiency',
    storeKey: 'chargingEfficiency',
    min: INPUT_RANGES.CHARGING_EFFICIENCY.MIN,
    max: INPUT_RANGES.CHARGING_EFFICIENCY.MAX,
    step: INPUT_RANGES.CHARGING_EFFICIENCY.STEP,
    unit: '%',
    allowDecimals: false
  },
  {
    id: 'energy-consumption',
    label: 'Energy Consumption',
    key: 'consumptionKwhPer100km',
    storeKey: 'consumptionKwhPer100km',
    min: INPUT_RANGES.ENERGY_CONSUMPTION.MIN,
    max: INPUT_RANGES.ENERGY_CONSUMPTION.MAX,
    step: INPUT_RANGES.ENERGY_CONSUMPTION.STEP,
    unit: 'kWh/100km',
    allowDecimals: true
  }
];

/**
 * Flat rate input fields
 */
export function getFlatRateFields(currency: string) {
  return [
    {
      id: 'electricity-rate',
      label: 'Electricity Rate',
      key: 'electricityRate',
      storeKey: 'electricityRate',
      min: INPUT_RANGES.ELECTRICITY_RATE.MIN,
      max: INPUT_RANGES.ELECTRICITY_RATE.MAX,
      step: INPUT_RANGES.ELECTRICITY_RATE.STEP,
      unit: `${currency}/kWh`,
      allowDecimals: true
    }
  ];
}

/**
 * Variable rate input fields
 */
export function getVariableRateFields(currency: string) {
  return [
    {
      id: 'peak-electricity-rate',
      label: 'Peak Rate',
      key: 'peakElectricityRate',
      storeKey: 'peakElectricityRate',
      min: INPUT_RANGES.ELECTRICITY_RATE.MIN,
      max: INPUT_RANGES.ELECTRICITY_RATE.MAX,
      step: INPUT_RANGES.ELECTRICITY_RATE.STEP,
      unit: `${currency}/kWh`,
      allowDecimals: true
    },
    {
      id: 'off-peak-electricity-rate',
      label: 'Off-Peak Rate',
      key: 'offPeakElectricityRate',
      storeKey: 'offPeakElectricityRate',
      min: INPUT_RANGES.ELECTRICITY_RATE.MIN,
      max: INPUT_RANGES.ELECTRICITY_RATE.MAX,
      step: INPUT_RANGES.ELECTRICITY_RATE.STEP,
      unit: `${currency}/kWh`,
      allowDecimals: true
    },
    {
      id: 'off-peak-percentage',
      label: 'Off-Peak Charging',
      key: 'chargingDuringOffPeak',
      storeKey: 'chargingDuringOffPeak',
      min: 0,
      max: 100,
      step: 5,
      unit: '%',
      allowDecimals: false
    }
  ];
}

/**
 * Get input fields based on rate type
 */
export function getCostInputFields(rateType: RateType, currency: string) {
  return rateType === 'flat'
    ? [...baseInputFields, ...getFlatRateFields(currency)]
    : [...baseInputFields, ...getVariableRateFields(currency)];
}

/**
 * Calculate function for cost calculator
 */
export function calculateCostResults(formData: Record<string, number>, rateType: RateType) {
  // Calculate energy needed for a single charge
  const chargeRange = formData.targetCharge - formData.initialCharge;
  const energyNeeded = (formData.batteryKwh * chargeRange) / 100;
  const energyWithEfficiency = energyNeeded / (formData.chargingEfficiency / 100);

  // Calculate effective range for weekly charges
  const effectiveRangeKm =
    (formData.batteryKwh * (formData.targetCharge - formData.initialCharge)) /
    100 /
    (formData.consumptionKwhPer100km / 100);

  // Calculate weekly charges
  const weeklyCharges = calculateWeeklyCharges({
    weeklyDistanceKm: formData.weeklyDistanceKm,
    effectiveRangeKm
  });

  // Configure charging cost calculation based on rate type
  const costParams: {
    energyNeededKwh: number;
    baseElectricityRate: number;
    includeFees: boolean;
    fixedFee: number;
    taxRate: number;
    useTimeOfUseRates: boolean;
    peakRate?: number;
    offPeakRate?: number;
    chargingDuringOffPeak?: number;
  } = {
    energyNeededKwh: energyWithEfficiency,
    baseElectricityRate: formData.electricityRate,
    includeFees: false,
    fixedFee: 0,
    taxRate: 0,
    useTimeOfUseRates: false
  };

  if (rateType === 'variable') {
    // Variable rate calculation
    costParams.useTimeOfUseRates = true;
    costParams.peakRate = formData.peakElectricityRate;
    costParams.offPeakRate = formData.offPeakElectricityRate;
    costParams.chargingDuringOffPeak = formData.chargingDuringOffPeak;
  }

  // Calculate costs
  const costResult = calculateChargingCost(costParams);

  // Return full results
  return {
    costPerCharge: costResult.totalCost,
    weeklyCost: costResult.totalCost * weeklyCharges,
    monthlyCost: costResult.totalCost * weeklyCharges * 4.33, // Average weeks per month
    annualCost: costResult.totalCost * weeklyCharges * 52,
    energyPerCharge: energyWithEfficiency
  };
}

/**
 * Tips function for cost calculator
 */
export function getCostCalculatorTips(): string[] {
  return getCostTips();
}
