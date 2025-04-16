<script lang="ts">
  import type { CalculatorData, FormData, InputField, CalculatorResults } from '$lib/types';
  import Alert from '../ui/Alert.svelte';
  import ParameterForm from '../ui/ParameterForm.svelte';
  import ParameterFormSkeleton from '../ui/skeletons/ParameterFormSkeleton.svelte';
  import StatsSkeleton from '../ui/skeletons/StatsSkeleton.svelte';
  import TipsSkeleton from '../ui/skeletons/TipsSkeleton.svelte';
  import Tips from '../ui/Tips.svelte';

  // Import helper functions
  import { generateInputConfigurations, initializeCalculator, processFormChange } from '$lib/utils/calculatorHelpers';

  // Configurable props
  let {
    title = 'Calculator',
    inputFields = [],
    calculateFn,
    statsComponent,
    getTips = ((_data: Record<string, unknown>) => []) as (data: Record<string, unknown>) => string[],
    children = undefined,
    currency = undefined
  } = $props();

  // Component state
  let isLoading = $state(true);
  let isInitialized = $state(false);
  let error = $state<string | null>(null);
  let formData = $state<FormData>({});
  let results = $state<CalculatorResults>({});
  let tips = $state<string[]>([]);

  // Function to update component state
  function updateState(updates: {
    formData?: FormData;
    results?: CalculatorResults;
    tips?: string[];
    isLoading?: boolean;
    error?: string | null;
    isInitialized?: boolean;
  }): void {
    // Update each state property if provided
    if (updates.formData !== undefined) formData = updates.formData;
    if (updates.results !== undefined) results = updates.results;
    if (updates.tips !== undefined) tips = updates.tips;
    if (updates.isLoading !== undefined) isLoading = updates.isLoading;
    if (updates.error !== undefined) error = updates.error;
    if (updates.isInitialized !== undefined) isInitialized = updates.isInitialized;
  }

  // Generate input configurations for the form
  const inputs = $derived(
    generateInputConfigurations(inputFields, formData, () =>
      processFormChange(formData, inputFields, calculateFn, getTips, updateState)
    )
  );

  // Initialize the calculator once when the component mounts
  $effect(() => {
    if (!isInitialized) {
      initializeCalculator(inputFields, calculateFn, getTips, updateState);
    }
  });

  // Component for displaying statistics (passed as prop)
  const StatsComponent = statsComponent;
</script>

{#if error}
  <Alert type="error" message={error} />
{/if}

{#if isLoading}
  <ParameterFormSkeleton rows={inputFields.length} {title} />
  <StatsSkeleton columns={3} title="Results" />
  <TipsSkeleton title="Tips" />
{:else}
  {@render children?.()}
  <ParameterForm {title} {inputs} />
  <StatsComponent {results} {formData} title="Results" {currency} />
  <Tips title="Tips" {tips} color="success" />
{/if}
