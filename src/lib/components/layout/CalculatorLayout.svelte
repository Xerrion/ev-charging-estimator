<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import type { Component } from 'svelte';

  let {
    title,
    description,
    calculator,
    explanation = null
  } = $props<{
    title: string;
    description: string;
    calculator: () => Component;
    explanation?: () => string;
  }>();

  // Get the component directly
  const CalculatorComponent = calculator();
</script>

<div class="w-full">
  <Card className="mb-6">
    <h2 class="text-base-content mb-4 text-xl font-semibold">{title}</h2>
    <p class="text-base-content/70 mb-6">
      {description}
    </p>

    {#if CalculatorComponent}
      <CalculatorComponent />
    {/if}
  </Card>

  {#if explanation}
    <Card>
      <svelte:fragment>
        {@html explanation()}
      </svelte:fragment>
    </Card>
  {/if}
</div>
