<script lang="ts">
  import Card from './Card.svelte';

  let {
    className = '',
    title = '',
    children
  } = $props<{
    className?: string;
    title?: string;
    children?: () => unknown;
  }>();

  let windowWidth = $state(typeof window !== 'undefined' ? window.innerWidth : 0);
  let vertical = $state(false);

  $effect(() => {
    vertical = windowWidth < 768;
  });
</script>

<svelte:window bind:innerWidth={windowWidth} />

<Card {className} {title}>
  <div class="stats w-full {vertical ? 'stats-vertical' : ''}">
    {@render children?.()}
  </div>
</Card>
