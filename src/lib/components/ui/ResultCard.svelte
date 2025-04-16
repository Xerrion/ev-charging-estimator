<script lang="ts">
  import { formatValue } from '$lib/utils/formatters';
  import Card from './Card.svelte';

  let {
    title,
    value,
    unit = '',
    description = '',
    color = 'primary',
    className = ''
  } = $props<{
    title: string;
    value: number | string;
    unit?: string;
    description?: string;
    color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
    className?: string;
  }>();
</script>

<Card {className}>
  <div class="flex items-start justify-between">
    <div class="flex-1">
      <h3 class="text-base-content mb-2 font-semibold">{title}</h3>
      <div class="text-{color} mb-2 text-3xl font-bold">
        {formatValue(value)}{value ? unit : ''}
      </div>
      {#if description}
        <p class="text-base-content/70 text-sm">{description}</p>
      {/if}
    </div>
  </div>
</Card>
