<script lang="ts">
	let {
		className = '',
		vertical = false,
		children
	} = $props<{
		className?: string;
		vertical?: boolean;
		children?: any;
	}>();
</script>

<div
	class="stats w-full shadow {vertical
		? 'stats-vertical'
		: ''} grid-flow-row lg:grid-flow-col {className}"
>
	{@render children?.()}
</div>
