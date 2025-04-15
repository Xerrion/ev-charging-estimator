<script>
	import CalculatorLayout from '$lib/components/layout/CalculatorLayout.svelte';
	import ChargingTimeCalculator from '$lib/components/calculators/charging-time/ChargingTimeCalculator.svelte';
</script>

<CalculatorLayout
	title="Charging Time Calculator"
	description="Calculate how long it will take to charge your electric vehicle from the initial charge level to your target level."
	calculator={() => ChargingTimeCalculator}
	explanation={() => {
		return `
			<h2 class="text-base-content mb-4 text-xl font-semibold">How it works</h2>
			<p class="text-base-content/70 mb-3">
				Charging time is affected by multiple factors:
			</p>
			<ul class="text-base-content/70 mb-4 list-disc space-y-2 pl-6">
				<li>Faster chargers (higher kW) will reduce charging time</li>
				<li>Charging efficiency accounts for heat and other energy losses</li>
				<li>Most EVs charge faster between 20% and 80% battery levels</li>
				<li>DC fast charging typically slows down above 80% to protect the battery</li>
			</ul>
		`;
	}}
/>
