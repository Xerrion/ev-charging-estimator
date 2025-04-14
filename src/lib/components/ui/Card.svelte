<script lang="ts">
	let {
		title = '',
		className = '',
		children
	} = $props<{
		title?: string;
		className?: string;
		children?: any;
	}>();
</script>

<div class="card bg-base-100 shadow-md {className}">
	{#if title}
		<div class="card-title p-6 pb-2 text-lg font-semibold">{title}</div>
	{/if}
	<div class="card-body pt-2">
		{@render children?.()}
	</div>
</div>
