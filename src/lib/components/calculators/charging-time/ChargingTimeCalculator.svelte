<script lang="ts">
  import BaseCalculator from '$lib/components/calculators/BaseCalculator.svelte';
  import ChargingTimeStats from './ChargingTimeStats.svelte';
  import {
    chargingTimeInputFields,
    calculateChargingTimeResults,
    getChargingTimeCalculatorTips
  } from '$lib/utils/calculators/charging-time';
  import { calculateChargingTime } from '$lib/utils/calculations';
  import { getChargingTimeTips } from '$lib/utils/tips';

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
  inputFields={chargingTimeInputFields}
  calculateFn={calculateChargingTimeResults}
  statsComponent={ChargingTimeStats}
  {getTips}
/>
