<script lang="ts">
  import BaseCalculatorLayout from '$lib/components/layout/BaseCalculatorLayout.svelte';
  import FrequencyCalculator from '$lib/components/calculators/frequency/FrequencyCalculator.svelte';
  import type { PageData } from './$types';

  // Get data from the load function
  let { data } = $props<{ data: PageData }>();

  const explanationHTML = `
    <h2 class="text-base-content mb-4 text-xl font-semibold">How it works</h2>
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
</script>

<svelte:head>
  <title>EV Charge Frequency Calculator</title>
  <meta
    name="description"
    content="Calculate how many times you'll need to charge your electric vehicle per week based on your driving habits and vehicle specifications."
  />
</svelte:head>

<BaseCalculatorLayout
  title="Charge Frequency Calculator"
  description="Calculate how many times you'll need to charge your electric vehicle per week based on your driving habits and vehicle specifications."
  calculator={FrequencyCalculator}
  explanation={explanationHTML}
/>
