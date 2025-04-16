<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import type { Component } from 'svelte';

  let {
    title,
    description,
    calculator,
    calculatorProps = {},
    explanation = null
  } = $props<{
    title: string;
    description: string;
    calculator: () => Component;
    calculatorProps?: Record<string, any>;
    explanation?: () => string;
  }>();

  // Get the component directly
  const CalculatorComponent = calculator();
</script>

<div class="w-full">
  <Card className="mb-6" {title} {description}></Card>
  {#if CalculatorComponent}
    <CalculatorComponent {...calculatorProps} />
  {/if}

  {#if explanation}
    <Card>
      {@html explanation()}
    </Card>
  {/if}
</div>
