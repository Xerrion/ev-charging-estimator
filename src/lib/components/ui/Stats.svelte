<script lang="ts">
	import StatsGroup from './StatsGroup.svelte';
	import StatCard from './StatCard.svelte';

	let { stats } = $props<{
		stats: Array<{
			title: string;
			value: number | string;
			unit?: string;
			description?: string;
			color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
		}>;
	}>();
</script>

<StatsGroup>
	{#snippet children()}
		{#each stats as stat}
			<StatCard
				title={stat.title}
				value={stat.value}
				unit={stat.unit || ''}
				description={stat.description || ''}
				color={stat.color || 'primary'}
			/>
		{/each}
	{/snippet}
</StatsGroup>
