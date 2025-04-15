<script lang="ts">
  let {
    title = '',
    description = '',
    className = '',
    children
  } = $props<{
    title?: string;
    description?: string;
    className?: string;
    children?: () => unknown;
  }>();
</script>

<div class="card card-border bg-base-100 card-md shadow-sm {className} mb-6">
  <div class="card-body">
    {#if title}
      <div class="card-title">{title}</div>
    {/if}

    {#if description}
      <div class="card-description">{description}</div>
    {/if}
    {@render children?.()}
  </div>
</div>
