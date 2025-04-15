<script lang="ts">
  import StatsGroup from '../StatsGroup.svelte';

  let { columns = 3 } = $props<{
    columns?: number;
  }>();
</script>

<StatsGroup>
  {#snippet children()}
    {#each Array(columns) as _}
      <div class="flex flex-col items-center gap-2">
        <div class="skeleton h-4 w-20"></div>
        <div class="skeleton h-8 w-36"></div>
        <div class="skeleton h-4 w-40"></div>
      </div>
    {/each}
  {/snippet}
</StatsGroup>
