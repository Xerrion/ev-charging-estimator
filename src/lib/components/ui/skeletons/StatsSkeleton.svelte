<script lang="ts">
	import Skeleton from './Skeleton.svelte';
	import StatsGroup from '../StatsGroup.svelte';

	let { columns = 2 } = $props<{
		columns?: number;
	}>();
</script>

<StatsGroup className="py-3">
	{#snippet children()}
		{#each Array(columns) as _, i}
			<div class="stat place-items-center py-4">
				<!-- Stat title (small) -->
				<div class="stat-title mb-2">
					<Skeleton height="4" width="32" />
				</div>
				<!-- Stat value (large) -->
				<div class="stat-value my-2">
					<Skeleton className="my-3" height="16" width="24" />
				</div>
				<!-- Stat description (small) -->
				<div class="stat-desc mt-2">
					<Skeleton height="4" width="40" />
				</div>
			</div>
		{/each}
	{/snippet}
</StatsGroup>
