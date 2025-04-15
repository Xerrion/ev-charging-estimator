<script lang="ts">
  import Card from '../Card.svelte';
  import RangeInputSkeleton from './RangeInputSkeleton.svelte';
  let { rows = 3, title = 'EV Parameters' } = $props<{
    rows?: number;
    title?: string;
  }>();
</script>

<Card {title}>
  {#each Array(rows) as _, i}
    <RangeInputSkeleton />
  {/each}
</Card>
