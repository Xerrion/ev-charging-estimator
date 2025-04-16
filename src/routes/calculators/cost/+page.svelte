<script lang="ts">
  import CalculatorLayout from '$lib/components/layout/CalculatorLayout.svelte';
  import CostCalculator from '$lib/components/calculators/cost/CostCalculator.svelte';
  import type { PageData } from './$types';

  // Get data from the load function
  let { data } = $props<{ data: PageData }>();
</script>

<CalculatorLayout
  title="Charging Cost Calculator"
  description="Calculate how much it costs to charge your electric vehicle based on electricity rates and charging habits."
  calculator={() => CostCalculator}
  calculatorProps={{
    regionalRates: data.regionalRates,
    chargingNetworks: data.chargingNetworks,
    currencies: data.currencies
  }}
  explanation={() => {
    return `
			<h2 class="text-base-content mb-4 text-xl font-semibold">How it works</h2>
			<p class="text-base-content/70 mb-3">
				The cost calculator will help you understand your EV charging expenses:
			</p>
			<ul class="text-base-content/70 mb-4 list-disc space-y-2 pl-6">
				<li>Compare home charging costs vs. public stations</li>
				<li>Calculate cost differences between peak and off-peak electricity rates</li>
				<li>Estimate your annual EV charging budget</li>
				<li>Compare costs across different regions and charging networks</li>
				<li>Convert costs to your preferred currency</li>
			</ul>
		`;
  }}
/>
