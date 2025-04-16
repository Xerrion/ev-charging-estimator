import { INPUT_RANGES } from '$lib/utils/constants';
import { getFrequencyTips } from '$lib/utils/tips';
import { weeklyEvChargeEstimator } from '$lib/utils/calculations';
import type { InputField } from '$lib/types';

/**
 * Input field configurations for the frequency calculator
 */
export const frequencyInputFields: InputField[] = [
  {
    key: 'weeklyDistanceKm',
    storeKey: 'weeklyDistanceKm',
    label: 'Weekly Distance',
    type: 'range',
    min: INPUT_RANGES.WEEKLY_DISTANCE.MIN,
    max: INPUT_RANGES.WEEKLY_DISTANCE.MAX,
    step: INPUT_RANGES.WEEKLY_DISTANCE.STEP,
    unit: 'km',
    allowDecimals: false
  },
  {
    key: 'batteryKwh',
    storeKey: 'batteryKwh',
    label: 'Battery Capacity',
    type: 'range',
    min: INPUT_RANGES.BATTERY_CAPACITY.MIN,
    max: INPUT_RANGES.BATTERY_CAPACITY.MAX,
    step: INPUT_RANGES.BATTERY_CAPACITY.STEP,
    unit: 'kWh',
    allowDecimals: false
  },
  {
    key: 'consumptionKwhPer100km',
    storeKey: 'consumptionKwhPer100km',
    label: 'Energy Consumption',
    type: 'range',
    min: INPUT_RANGES.ENERGY_CONSUMPTION.MIN,
    max: INPUT_RANGES.ENERGY_CONSUMPTION.MAX,
    step: INPUT_RANGES.ENERGY_CONSUMPTION.STEP,
    unit: 'kWh/100km',
    allowDecimals: true
  },
  {
    key: 'usableFraction',
    storeKey: 'usableFraction',
    label: 'Usable Battery',
    type: 'range',
    min: INPUT_RANGES.USABLE_BATTERY.MIN,
    max: INPUT_RANGES.USABLE_BATTERY.MAX,
    step: INPUT_RANGES.USABLE_BATTERY.STEP,
    unit: '%',
    allowDecimals: false
  }
];

/**
 * Calculate function for frequency calculator
 * @param formData The form data to calculate from
 * @returns Calculation results
 */
export function calculateFrequencyResults(formData: Record<string, number | string>) {
  const { weeklyDistanceKm, batteryKwh, consumptionKwhPer100km, usableFraction } = formData as Record<string, number>;

  return weeklyEvChargeEstimator({
    weeklyDistanceKm,
    batteryKwh,
    consumptionKwhPer100km,
    usableFraction
  });
}

/**
 * Get tips for the frequency calculator
 * @param data The data to generate tips from
 * @returns Array of tips
 */
export function getFrequencyCalculatorTips(data: Record<string, unknown>): string[] {
  return getFrequencyTips({
    weeklyDistanceKm: data.weeklyDistanceKm as number,
    batteryKwh: data.batteryKwh as number,
    consumptionKwhPer100km: data.consumptionKwhPer100km as number,
    usableFraction: data.usableFraction as number,
    effectiveRangeKm: data.effectiveRangeKm as number,
    weeklyCharges: data.weeklyCharges as number
  });
}
