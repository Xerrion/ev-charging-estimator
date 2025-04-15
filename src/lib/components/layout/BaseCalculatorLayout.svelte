<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import type { ComponentType } from 'svelte';

  let {
    title = 'EV Calculator',
    description = '',
    calculator,
    calculatorProps = {},
    explanation = '',
    className = ''
  } = $props<{
    title?: string;
    description?: string;
    calculator: ComponentType;
    calculatorProps?: Record<string, any>;
    explanation?: string;
    className?: string;
  }>();

  const CalculatorComponent = calculator;
</script>

<div class="w-full {className}">
  <!-- Header with title and description -->
  <Card className="mb-6">
    <h1 class="mb-2 text-2xl font-bold">{title}</h1>
    {#if description}
      <p class="text-base-content/80">{description}</p>
    {/if}
  </Card>

  <!-- Calculator component -->
  <div class="calculator-content">
    <CalculatorComponent {...calculatorProps} />
  </div>

  <!-- Explanation section -->
  {#if explanation}
    <Card className="mt-6">
      <svelte:fragment>
        {@html explanation}
      </svelte:fragment>
    </Card>
  {/if}
</div>
