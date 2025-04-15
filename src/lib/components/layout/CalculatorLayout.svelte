<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';

	let {
		title,
		description,
		calculator,
		explanation = null
	} = $props<{
		title: string;
		description: string;
		calculator: any;
		explanation?: any;
	}>();

	// Get the component directly
	const Component = calculator();
</script>

<div class="w-full">
	<Card className="mb-6">
		<svelte:fragment>
			<h2 class="text-base-content mb-4 text-xl font-semibold">{title}</h2>
			<p class="text-base-content/70 mb-6">
				{description}
			</p>

			{#if Component}
				<Component />
			{/if}
		</svelte:fragment>
	</Card>

	{#if explanation}
		<Card>
			<svelte:fragment>
				{@html explanation()}
			</svelte:fragment>
		</Card>
	{/if}
</div>
