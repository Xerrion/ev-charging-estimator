<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import StatsGroup from '$lib/components/ui/StatsGroup.svelte';
  import StatCardSkeleton from '$lib/components/ui/skeletons/StatSkeleton.svelte';

  let { columns = 3 } = $props<{
    columns?: number;
  }>();
</script>

<StatsGroup>
  {#snippet children()}
    {#each Array(columns) as _}
      <StatCardSkeleton />
    {/each}
  {/snippet}
</StatsGroup>
