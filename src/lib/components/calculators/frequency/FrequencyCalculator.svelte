<script lang="ts">
  import BaseCalculator from '$lib/components/calculators/BaseCalculator.svelte';
  import FrequencyStats from './FrequencyStats.svelte';
  import {
    frequencyInputFields,
    calculateFrequencyResults,
    getFrequencyCalculatorTips
  } from '$lib/utils/calculators/frequency';
</script>

<BaseCalculator
  title="Charging Parameters"
  inputFields={frequencyInputFields}
  calculateFn={calculateFrequencyResults}
  statsComponent={FrequencyStats}
  getTips={getFrequencyCalculatorTips}
/>
