<script lang="ts">
  import StatsGroup from './StatsGroup.svelte';
  import Stat from './Stat.svelte';

  let { stats, className, title } = $props<{
    className?: string;
    title?: string;
    stats: Array<{
      title: string;
      value: number | string;
      unit?: string;
      description?: string;
      color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
    }>;
  }>();
</script>

<StatsGroup {className} {title}>
  {#snippet children()}
    {#each stats as stat}
      <Stat
        title={stat.title}
        value={stat.value}
        unit={stat.unit || ''}
        description={stat.description || ''}
        color={stat.color || 'primary'}
      />
    {/each}
  {/snippet}
</StatsGroup>
