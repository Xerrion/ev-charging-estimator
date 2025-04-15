<script lang="ts">
  import BaseCalculator from '$lib/components/calculators/BaseCalculator.svelte';
  import FrequencyStats from './FrequencyStats.svelte';
  import { INPUT_RANGES } from '$lib/utils/constants';
  import { getFrequencyTips, getErrorTips } from '$lib/utils/tips';
  import { weeklyEvChargeEstimator } from '$lib/utils/calculations';

  // Define input fields configuration
  const inputFields = [
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
      id: 'energy-consumption',
      label: 'Energy Consumption',
      key: 'consumptionKwhPer100km',
      storeKey: 'consumptionKwhPer100km',
      min: INPUT_RANGES.ENERGY_CONSUMPTION.MIN,
      max: INPUT_RANGES.ENERGY_CONSUMPTION.MAX,
      step: INPUT_RANGES.ENERGY_CONSUMPTION.STEP,
      unit: 'kWh/100km',
      allowDecimals: true
    },
    {
      id: 'usable-battery',
      label: 'Usable Battery',
      key: 'usableFraction',
      storeKey: 'usableFraction',
      min: INPUT_RANGES.USABLE_BATTERY.MIN,
      max: INPUT_RANGES.USABLE_BATTERY.MAX,
      step: INPUT_RANGES.USABLE_BATTERY.STEP,
      unit: '%',
      allowDecimals: false
    }
  ];

  // Calculate function
  function calculateResults(formData: Record<string, number>) {
    const { weeklyDistanceKm, batteryKwh, consumptionKwhPer100km, usableFraction } = formData;

    // Convert usableFraction from percent to decimal
    const fraction = usableFraction / 100;

    return weeklyEvChargeEstimator({
      weeklyDistanceKm,
      batteryKwh,
      consumptionKwhPer100km,
      usableFraction: fraction
    });
  }

  // Tips function
  function getTips(data: Record<string, any>) {
    return getFrequencyTips({
      weeklyDistanceKm: data.weeklyDistanceKm,
      batteryKwh: data.batteryKwh,
      consumptionKwhPer100km: data.consumptionKwhPer100km,
      usableFraction: data.usableFraction / 100,
      effectiveRangeKm: data.effectiveRangeKm,
      weeklyCharges: data.weeklyCharges
    });
  }
</script>

<BaseCalculator
  title="EV Parameters"
  {inputFields}
  calculateFn={calculateResults}
  statsComponent={FrequencyStats}
  {getTips}
  {getErrorTips}
/>
