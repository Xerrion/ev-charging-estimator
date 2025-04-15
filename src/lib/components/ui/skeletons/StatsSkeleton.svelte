<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import StatsGroup from '$lib/components/ui/StatsGroup.svelte';
  import StatCardSkeleton from '$lib/components/ui/skeletons/StatSkeleton.svelte';

  let { columns = 3, title = 'Results' } = $props<{
    columns?: number;
    title?: string;
  }>();
</script>

<StatsGroup {title}>
  {#snippet children()}
    {#each Array(columns) as _}
      <StatCardSkeleton />
    {/each}
  {/snippet}
</StatsGroup>
