<script lang="ts">
  import BaseCalculator from '$lib/components/calculators/BaseCalculator.svelte';
  import ChargingTimeStats from './ChargingTimeStats.svelte';
  import { INPUT_RANGES } from '$lib/utils/constants';
  import { getChargingTimeTips, getErrorTips } from '$lib/utils/tips';
  import { calculateChargingTime } from '$lib/utils/calculations';

  // Define input fields configuration
  const inputFields = [
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
      id: 'charging-power',
      label: 'Charging Power',
      key: 'chargingPower',
      storeKey: 'chargingPower',
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
      min: INPUT_RANGES.PHASES.MIN,
      max: INPUT_RANGES.PHASES.MAX,
      step: INPUT_RANGES.PHASES.STEP,
      unit: '',
      allowDecimals: false
    }
  ];

  // Calculate function
  function calculateResults(formData: Record<string, number>) {
    const { batteryKwh, initialCharge, targetCharge, chargingPower, chargingEfficiency, temperatureC, phases } =
      formData;

    return calculateChargingTime({
      batteryKwh,
      initialCharge,
      targetCharge,
      chargingPower,
      chargingEfficiency,
      temperatureC,
      phases
    });
  }

  // Tips function
  function getTips(data: Record<string, any>) {
    return getChargingTimeTips({
      batteryKwh: data.batteryKwh,
      initialCharge: data.initialCharge,
      targetCharge: data.targetCharge,
      chargingPower: data.chargingPower,
      chargingEfficiency: data.chargingEfficiency,
      temperatureC: data.temperatureC,
      phases: data.phases,
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
