<script lang="ts">
	import ResultCard from '$lib/components/ui/ResultCard.svelte';
	import Tips from '$lib/components/ui/Tips.svelte';
	import { getCostTips } from '$lib/utils/tips';

	// Get cost tips from the utility
	const costTips = getCostTips();
</script>

<div class="w-full">
	<div class="prose">
		<h3>Coming Soon</h3>
		<p>
			The EV Charging Cost Calculator will help you estimate how much it costs to charge your
			electric vehicle based on electricity rates and charging habits.
		</p>
		<p>This feature is currently under development and will be available soon.</p>
	</div>

	<div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
		<ResultCard
			title="Cost Per Charge"
			value="Coming Soon"
			description="Calculate the cost of a single charge based on your electricity rates"
			color="accent"
		/>

		<ResultCard
			title="Annual Costs"
			value="Coming Soon"
			description="Estimate your yearly expenses for EV charging"
			color="info"
		/>
	</div>

	<div class="mt-6">
		<Tips title="Cost Saving Tips" tips={costTips} color="accent" />
	</div>
</div>
