<script lang="ts">
  import Card from './Card.svelte';

  let {
    title = 'Recommended Tips',
    tips = [],
    color = 'secondary',
    className = ''
  } = $props<{
    title?: string;
    tips: string[];
    color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
    className?: string;
  }>();
</script>

<Card {className}>
  <div class="bg-{color}-content/10 -m-4 mb-2 rounded-t-lg p-4">
    <h3 class="text-lg font-semibold text-{color}">{title}</h3>
  </div>
  <ul class="list-disc space-y-2 pl-5">
    {#each tips as tip}
      <li>{tip}</li>
    {/each}
  </ul>
</Card>
