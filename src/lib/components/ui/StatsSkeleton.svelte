<script lang="ts">
	import Skeleton from './Skeleton.svelte';

	let { columns = 4 } = $props<{
		columns?: number;
	}>();
</script>

<div class="stats h-[132px] w-full grid-flow-row shadow lg:grid-flow-col">
	{#each Array(columns) as _, i}
		<div class="stat place-items-center">
			<div class="stat-figure">
				<Skeleton height="8" width="8" rounded="full" />
			</div>
			<Skeleton className="mb-2" height="4" width="28" />
			<Skeleton className="mb-2" height="10" width="20" />
			<Skeleton height="3" width="32" />
		</div>
	{/each}
</div>
