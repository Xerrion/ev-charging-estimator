<script lang="ts">
  import Card from './Card.svelte';

  let {
    className = '',
    vertical = false,
    children
  } = $props<{
    className?: string;
    vertical?: boolean;
    children?: () => unknown;
  }>();
</script>

<Card {className}>
  <svelte:fragment>
    <div class="stats w-full {vertical ? 'stats-vertical' : ''} grid-flow-row lg:grid-flow-col">
      {@render children?.()}
    </div>
  </svelte:fragment>
</Card>
