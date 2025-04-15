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

  let isMobile = $state(false);
  let windowWidth = $state(typeof window !== 'undefined' ? window.innerWidth : 0);
  let vertical = $state(false);

  $effect(() => {
    isMobile = windowWidth < 768;

    if (isMobile) {
      vertical = true;
    } else {
      vertical = false;
    }
  });
</script>

<svelte:window bind:innerWidth={windowWidth} />

<Card {className} {title}>
  <svelte:fragment>
    <div class="stats w-full {vertical ? 'stats-vertical' : ''}">
      {@render children?.()}
    </div>
  </svelte:fragment>
</Card>
