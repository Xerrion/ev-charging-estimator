<script>
	import CalculatorLayout from '$lib/components/layout/CalculatorLayout.svelte';
	import CostCalculator from '$lib/components/calculators/cost/CostCalculator.svelte';
</script>

<CalculatorLayout
	title="EV Charging Cost Calculator"
	description="Calculate how much it costs to charge your electric vehicle based on electricity rates and charging habits."
	calculator={() => CostCalculator}
/>
