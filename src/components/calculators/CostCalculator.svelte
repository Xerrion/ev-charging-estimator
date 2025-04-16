<script lang="ts">
  import BaseCalculator from './BaseCalculator.svelte';
  import { costInputFields, calculateCostResults, getCostCalculatorTips } from '$lib/utils/calculators/cost';
</script>

<BaseCalculator
  title="Cost Calculator"
  description="Calculate the annual cost of charging your EV. Adjust the sliders to see how different factors affect your charging costs."
  inputFields={costInputFields}
  calculateFunction={calculateCostResults}
  tipsFunction={getCostCalculatorTips}
/>
