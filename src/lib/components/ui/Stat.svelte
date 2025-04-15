<script lang="ts">
	let {
		title,
		value,
		description = '',
		unit = '',
		color = 'primary'
	} = $props<{
		title: string;
		value: number | string;
		description?: string;
		unit?: string;
		color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
	}>();

	// Helper function to format the value if it's a number
	function formatValue(val: number | string): string {
		if (typeof val === 'number') {
			return Number.isNaN(val) || val === 0 ? 'N/A' : val.toString();
		}
		return val || 'N/A';
	}
</script>

<div class="stat">
	<div class="stat-title">{title}</div>
	<div class="stat-value text-{color}">
		{formatValue(value)}{value ? unit : ''}
	</div>
	{#if description}
		<div class="stat-desc">{description}</div>
	{/if}
</div>
