<script lang="ts">
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
	<div class="card bg-base-100 mb-6 p-6 shadow">
		<h2 class="text-base-content mb-4 text-xl font-semibold">{title}</h2>
		<p class="text-base-content/70 mb-6">
			{description}
		</p>

		{#if Component}
			<Component />
		{/if}
	</div>

	{#if explanation}
		<div class="card bg-base-100 p-6 shadow">
			{@html explanation()}
		</div>
	{/if}
</div>
