<script lang="ts">
  import Card from '../Card.svelte';
  let { title = 'Tips' } = $props<{
    title?: string;
  }>();
</script>

<Card {title}>
  <div class="rounded-box shadow">
    <!-- Tips list -->
    <div class="space-y-3">
      <div class="skeleton h-4 w-full"></div>
      <div class="skeleton h-4 w-11/12"></div>
      <div class="skeleton h-4 w-4/5"></div>
      <div class="skeleton h-4 w-9/12"></div>
    </div>
  </div>
</Card>
