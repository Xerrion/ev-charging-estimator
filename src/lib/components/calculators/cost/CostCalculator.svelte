<script lang="ts">
  import BaseCalculator from '$lib/components/calculators/BaseCalculator.svelte';
  import CostStats from './CostStats.svelte';
  import Card from '$lib/components/ui/Card.svelte';
  import { calculatorStore } from '$lib/state/CalculatorStore';
  import { get } from 'svelte/store';
  import type { RateType } from '$lib/utils/calculators/cost';
  import {
    getCostCurrencyOptions,
    getCostInputFields,
    calculateCostResults,
    getCostCalculatorTips
  } from '$lib/utils/calculators/cost';

  // State for rate type and currency
  let rateType = $state<RateType>('flat');
  let selectedCurrency = $state(get(calculatorStore).currency);
  let currencyOptions = $state(getCostCurrencyOptions());
  let currentFields = $derived(getCostInputFields(rateType, selectedCurrency));

  // Handle rate type change
  function handleRateTypeChange(type: RateType): void {
    rateType = type;
    currentFields = getCostInputFields(rateType, selectedCurrency);

    if (type === 'variable') {
      // Initialize variable rates if they're zeroed out
      calculatorStore.subscribe((state) => {
        if (state.peakElectricityRate === 0) {
          calculatorStore.updateValue('peakElectricityRate', state.electricityRate * 1.5);
          calculatorStore.updateValue('offPeakElectricityRate', state.electricityRate * 0.7);
        }
      })();
    }
  }

  // Subscribe to currency changes
  $effect(() => {
    const state = get(calculatorStore);
    if (state.currency !== selectedCurrency) {
      calculatorStore.updateValue('currency', selectedCurrency);
    }
    // Update input fields when currency changes
    currentFields = getCostInputFields(rateType, selectedCurrency);
  });

  // Update currency when selected
  function handleCurrencySelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    selectedCurrency = select.value;
    calculatorStore.updateValue('currency', selectedCurrency);
  }
</script>

<BaseCalculator
  title="Charging Parameters"
  inputFields={currentFields}
  calculateFn={calculateCostResults}
  statsComponent={CostStats}
  getTips={getCostCalculatorTips}
  currency={selectedCurrency}
>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <!-- Rate Type Selection -->
    <Card title="Rate Selection">
      <div class="flex flex-wrap gap-4">
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text mr-2">Flat Rate</span>
            <input
              type="radio"
              name="rate-type"
              class="radio"
              checked={rateType === 'flat'}
              onclick={() => handleRateTypeChange('flat')}
            />
          </label>
        </div>
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text mr-2">Variable Rate (Time-of-Use)</span>
            <input
              type="radio"
              name="rate-type"
              class="radio"
              checked={rateType === 'variable'}
              onclick={() => handleRateTypeChange('variable')}
            />
          </label>
        </div>
      </div>
    </Card>

    <!-- Currency selector -->
    <Card title="Currency">
      <div class="form-control w-full">
        <label for="currency-select" class="label">
          <span class="label-text">Select Currency</span>
        </label>
        <select id="currency-select" class="select select-bordered w-full" onchange={handleCurrencySelect}>
          {#each currencyOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
    </Card>
  </div>
</BaseCalculator>
