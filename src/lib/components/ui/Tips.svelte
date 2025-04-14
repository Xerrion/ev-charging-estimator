<script lang="ts">
	let {
		title = 'Recommended Tips',
		tips = [],
		color = 'secondary',
		className = ''
	} = $props<{
		title?: string;
		tips: string[];
		color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
		className?: string;
	}>();
</script>

<div class="rounded-box p-6 shadow bg-{color}-content {className}">
	<h3 class="mb-3 text-lg font-semibold">{title}</h3>
	<ul class="list-disc space-y-2 pl-5">
		{#each tips as tip}
			<li>{tip}</li>
		{/each}
	</ul>
</div>
