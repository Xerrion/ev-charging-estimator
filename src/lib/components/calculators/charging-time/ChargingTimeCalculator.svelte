<script lang="ts">
  import BaseCalculator from '$lib/components/calculators/BaseCalculator.svelte';
  import ChargingTimeStats from './ChargingTimeStats.svelte';
  import { INPUT_RANGES } from '$lib/utils/constants';
  import { getChargingTimeTips, getErrorTips } from '$lib/utils/tips';
  import { calculateChargingTime } from '$lib/utils/calculations';

  // Define input fields configuration
  const inputFields = [
    {
      id: 'charging-type',
      label: 'Charging Type',
      key: 'chargingType',
      storeKey: 'chargingType',
      type: 'radio' as const,
      options: [
        { value: 'AC', label: 'AC Charging (Home/Destination)' },
        { value: 'DC', label: 'DC Fast Charging' }
      ]
    },
    {
      id: 'battery-capacity',
      label: 'Battery Capacity',
      key: 'batteryKwh',
      storeKey: 'batteryKwh',
      type: 'range' as const,
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
      type: 'range' as const,
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
      type: 'range' as const,
      min: INPUT_RANGES.BATTERY_CHARGE.MIN,
      max: INPUT_RANGES.BATTERY_CHARGE.MAX,
      step: INPUT_RANGES.BATTERY_CHARGE.STEP,
      unit: '%',
      allowDecimals: false
    },
    {
      id: 'charging-power',
      label: 'Charging Power',
      key: 'chargingPower',
      storeKey: 'chargingPower',
      type: 'range' as const,
      min: INPUT_RANGES.CHARGING_POWER.MIN,
      max: INPUT_RANGES.CHARGING_POWER.MAX,
      step: INPUT_RANGES.CHARGING_POWER.STEP,
      unit: 'kW',
      allowDecimals: true
    },
    {
      id: 'charging-efficiency',
      label: 'Charging Efficiency',
      key: 'chargingEfficiency',
      storeKey: 'chargingEfficiency',
      type: 'range' as const,
      min: INPUT_RANGES.CHARGING_EFFICIENCY.MIN,
      max: INPUT_RANGES.CHARGING_EFFICIENCY.MAX,
      step: INPUT_RANGES.CHARGING_EFFICIENCY.STEP,
      unit: '%',
      allowDecimals: false
    },
    {
      id: 'temperature',
      label: 'Battery Temperature',
      key: 'temperatureC',
      storeKey: 'temperatureC',
      type: 'range' as const,
      min: INPUT_RANGES.TEMPERATURE.MIN,
      max: INPUT_RANGES.TEMPERATURE.MAX,
      step: INPUT_RANGES.TEMPERATURE.STEP,
      unit: '°C',
      allowDecimals: false
    },
    {
      id: 'phases',
      label: 'Charging Phases',
      key: 'phases',
      storeKey: 'phases',
      type: 'range' as const,
      min: INPUT_RANGES.PHASES.MIN,
      max: INPUT_RANGES.PHASES.MAX,
      step: INPUT_RANGES.PHASES.STEP,
      unit: '',
      allowDecimals: false
    }
  ];

  // Calculate function
  function calculateResults(formData: Record<string, number | string>) {
    // Ensure all numeric values are properly converted
    const params = {
      batteryKwh: Number(formData.batteryKwh),
      initialCharge: Number(formData.initialCharge),
      targetCharge: Number(formData.targetCharge),
      chargingPower: Number(formData.chargingPower),
      chargingEfficiency: Number(formData.chargingEfficiency),
      temperatureC: Number(formData.temperatureC),
      phases: Number(formData.phases),
      chargingType: formData.chargingType as 'AC' | 'DC'
    };

    // Validate input values
    if (params.initialCharge >= params.targetCharge) {
      throw new Error('Target charge must be higher than initial charge');
    }

    if (params.chargingPower <= 0) {
      throw new Error('Charging power must be greater than 0');
    }

    return calculateChargingTime(params);
  }

  // Tips function
  function getTips(data: Record<string, any>) {
    return getChargingTimeTips({
      batteryKwh: Number(data.batteryKwh),
      initialCharge: Number(data.initialCharge),
      targetCharge: Number(data.targetCharge),
      chargingPower: Number(data.chargingPower),
      chargingEfficiency: Number(data.chargingEfficiency),
      temperatureC: Number(data.temperatureC),
      phases: Number(data.phases),
      chargingTimeHours: data.chargingTimeHours,
      chargingTimeMinutes: data.chargingTimeMinutes,
      actualChargingPower: data.actualChargingPower,
      limitingFactor: data.limitingFactor
    });
  }
</script>

<BaseCalculator
  title="Charging Parameters"
  {inputFields}
  calculateFn={calculateResults}
  statsComponent={ChargingTimeStats}
  {getTips}
  {getErrorTips}
/>
