<script lang="ts">
  import Card from './Card.svelte';

  let {
    className = '',
    vertical = false,
    title = '',
    children
  } = $props<{
    className?: string;
    vertical?: boolean;
    title?: string;
    children?: () => unknown;
  }>();
</script>

<Card {className} {title}>
  <svelte:fragment>
    <div class="stats w-full {vertical ? 'stats-vertical' : ''} grid-flow-row lg:grid-flow-col">
      {@render children?.()}
    </div>
  </svelte:fragment>
</Card>
