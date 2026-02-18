<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children } = $props<{
    children: Snippet;
  }>();
</script>

<div class="container mx-auto px-4 py-8">
  {@render children()}
</div>
