<script lang="ts">
  import BaseCalculator from '$lib/components/calculators/BaseCalculator.svelte';
  import FrequencyStats from '$lib/components/calculators/frequency/FrequencyStats.svelte';
  import { INPUT_RANGES } from '$lib/utils/constants';
  import { getFrequencyTips } from '$lib/utils/tips';
  import { weeklyEvChargeEstimator } from '$lib/utils/calculations';

  // Define input fields for the frequency calculator
  const frequencyInputFields = [
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

  // Calculate function for frequency calculator
  function calculateFrequency(formData: Record<string, number>) {
    const { weeklyDistanceKm, batteryKwh, consumptionKwhPer100km, usableFraction } = formData;

    // The usableFraction is already properly converted to decimal in BaseCalculator's calculateResults function
    return weeklyEvChargeEstimator({
      weeklyDistanceKm,
      batteryKwh,
      consumptionKwhPer100km,
      usableFraction
    });
  }

  // Get tips for the frequency calculator
  function getTips(data: Record<string, any>) {
    return getFrequencyTips({
      weeklyDistanceKm: data.weeklyDistanceKm,
      batteryKwh: data.batteryKwh,
      consumptionKwhPer100km: data.consumptionKwhPer100km,
      usableFraction: data.usableFraction,
      effectiveRangeKm: data.effectiveRangeKm,
      weeklyCharges: data.weeklyCharges
    });
  }
</script>

<svelte:head>
  <title>EV Charge Frequency Calculator</title>
  <meta
    name="description"
    content="Calculate how many times you'll need to charge your electric vehicle per week based on your driving habits."
  />
</svelte:head>

<BaseCalculator
  title="EV Charging Frequency Calculator"
  inputFields={frequencyInputFields}
  calculateFn={calculateFrequency}
  statsComponent={FrequencyStats}
  {getTips}
/>
