<script lang="ts">
  import { formatValue } from '$lib/utils/formatters';

  let {
    title,
    value,
    description = '',
    unit = '',
    color = 'primary'
  } = $props<{
    title: string;
    value: number | string;
    description?: string;
    unit?: string;
    color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  }>();
</script>

<div class="stat place-items-center">
  <div class="stat-title">{title}</div>
  <div class="stat-value text-{color}">
    {formatValue(value)}{value ? unit : ''}
  </div>
  {#if description}
    <div class="stat-desc">{description}</div>
  {/if}
</div>
