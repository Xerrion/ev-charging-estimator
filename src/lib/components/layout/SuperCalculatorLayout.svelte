<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import type { Component } from 'svelte';
  import FrequencyCalculator from '$lib/components/calculators/frequency/FrequencyCalculator.svelte';
  import ChargingTimeCalculator from '$lib/components/calculators/charging-time/ChargingTimeCalculator.svelte';
  import CostCalculator from '$lib/components/calculators/cost/CostCalculator.svelte';

  // Define available calculator types
  type CalculatorType = 'frequency' | 'charging-time' | 'cost';

  // Define calculator info
  const calculators = {
    frequency: {
      component: FrequencyCalculator,
      title: 'Charge Frequency',
      description: "Calculate how many times you'll need to charge your EV per week",
      icon: '🔄'
    },
    'charging-time': {
      component: ChargingTimeCalculator,
      title: 'Charging Time',
      description: 'Estimate how long it takes to charge your electric vehicle',
      icon: '⏱️'
    },
    cost: {
      component: CostCalculator,
      title: 'Charging Cost',
      description: 'Calculate the costs associated with charging your EV',
      icon: '💰'
    }
  };

  // Props
  let {
    title = 'EV Charging Calculator',
    description = 'All-in-one tool for EV charging calculations',
    initialCalculator = 'frequency',
    showExplanation = true
  } = $props<{
    title?: string;
    description?: string;
    initialCalculator?: CalculatorType;
    showExplanation?: boolean;
  }>();

  // State
  let activeCalculator = $state<CalculatorType>(initialCalculator);
  let calculatorComponent = $state<Component | null>(null);
  let calculatorProps = $state<Record<string, any>>({});

  // Update active calculator component when tab changes
  $effect(() => {
    calculatorComponent = calculators[activeCalculator].component;
  });

  // Handle tab change
  function changeCalculator(calculatorType: CalculatorType) {
    activeCalculator = calculatorType;
  }

  // Get explanation for the current calculator
  function getExplanation(type: CalculatorType): string {
    switch (type) {
      case 'frequency':
        return `
          <h2 class="text-base-content mb-4 text-xl font-semibold">How the Frequency Calculator works</h2>
          <p class="text-base-content/70 mb-3">
            This calculator uses the following formula to estimate your charging frequency:
          </p>
          <ol class="text-base-content/70 mb-4 list-decimal space-y-2 pl-6">
            <li>
              Calculate effective range: (Battery capacity × Usable battery percentage) ÷ Energy
              consumption × 100
            </li>
            <li>Calculate weekly charges: Weekly distance ÷ Effective range (rounded up)</li>
          </ol>
          <p class="text-base-content/60 text-sm">
            Note: This is an estimate and actual charging frequency may vary based on driving conditions,
            temperature, and other factors.
          </p>
        `;
      case 'charging-time':
        return `
          <h2 class="text-base-content mb-4 text-xl font-semibold">How the Charging Time Calculator works</h2>
          <p class="text-base-content/70 mb-3">
            This calculator estimates charging time based on:
          </p>
          <ol class="text-base-content/70 mb-4 list-decimal space-y-2 pl-6">
            <li>Battery capacity and the required charge level change</li>
            <li>Charging power and efficiency of your charging equipment</li>
            <li>Environmental factors like temperature that affect charging speed</li>
            <li>Technical limitations of the vehicle's battery management system</li>
          </ol>
          <p class="text-base-content/60 text-sm">
            Note: Actual charging times may vary based on battery condition, temperature, and charging equipment.
          </p>
        `;
      case 'cost':
        return `
          <h2 class="text-base-content mb-4 text-xl font-semibold">How the Cost Calculator works</h2>
          <p class="text-base-content/70 mb-3">
            This calculator estimates your EV charging costs by considering:
          </p>
          <ol class="text-base-content/70 mb-4 list-decimal space-y-2 pl-6">
            <li>Energy required for a single charge based on your battery and charging levels</li>
            <li>Electricity rates (flat or time-of-use)</li>
            <li>Charging frequency based on your weekly driving distance</li>
          </ol>
          <p class="text-base-content/60 text-sm">
            Note: Actual costs may vary based on electricity provider, rates, and charging behavior.
          </p>
        `;
      default:
        return '';
    }
  }
</script>

<div class="w-full">
  <!-- Main title and description -->
  <Card className="mb-6" {title} {description}></Card>

  <!-- Calculator tabs -->
  <div class="tabs tabs-boxed mb-6">
    {#each Object.entries(calculators) as [type, info]}
      <button
        class="tab {activeCalculator === type ? 'tab-active' : ''}"
        onclick={() => changeCalculator(type as CalculatorType)}
      >
        <span class="mr-1">{info.icon}</span>
        {info.title}
      </button>
    {/each}
  </div>

  <!-- Active calculator description -->
  <Card className="mb-6">
    <h2 class="mb-2 text-xl font-bold">
      {calculators[activeCalculator].title} Calculator
    </h2>
    <p class="text-base-content/80">
      {calculators[activeCalculator].description}
    </p>
  </Card>

  <!-- Calculator component -->
  {#if calculatorComponent}
    {@render calculatorComponent(calculatorProps)}
  {/if}

  <!-- Explanation section -->
  {#if showExplanation}
    <Card className="mt-6">
      <svelte:fragment>
        {@html getExplanation(activeCalculator)}
      </svelte:fragment>
    </Card>
  {/if}
</div>
