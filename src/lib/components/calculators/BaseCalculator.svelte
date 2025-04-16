<script lang="ts">
  import { calculatorStore } from '$lib/state/CalculatorStore';
  import type { CalculatorData, FormData, InputField, CalculatorProps, CalculatorResults } from '$lib/types';
  import { DEFAULT_VALUES, INPUT_RANGES } from '$lib/utils/constants';
  import { get } from 'svelte/store';

  import { formatValue } from '$lib/utils/formatters';
  import Alert from '../ui/Alert.svelte';
  import ParameterForm from '../ui/ParameterForm.svelte';
  import ParameterFormSkeleton from '../ui/skeletons/ParameterFormSkeleton.svelte';
  import StatsSkeleton from '../ui/skeletons/StatsSkeleton.svelte';
  import TipsSkeleton from '../ui/skeletons/TipsSkeleton.svelte';
  import Tips from '../ui/Tips.svelte';

  // Configurable props
  let {
    title = 'Calculator',
    inputFields = [],
    calculateFn,
    statsComponent,
    getTips = () => [],
    getErrorTips = () => ['Check your input values and try again'],
    children,
    currency
  } = $props();

  // Component state
  let isLoading = $state(true);
  let isInitialized = $state(false);
  let error = $state<string | null>(null);

  // Form data and results
  let formData = $state<FormData>({});
  let results = $state<CalculatorResults>({});
  let tips = $state<string[]>([]);

  // Initialize with timeout for smoother UX
  $effect(() => {
    setTimeout(() => {
      initializeFromStore();
    }, 800);
  });

  // Initialize form data from calculator store
  function initializeFromStore(): void {
    try {
      isLoading = true;
      formData = inputFields.reduce((acc: FormData, field: InputField) => {
        const storeKey = field.storeKey || field.key;
        const settings = get(calculatorStore);
        const storedValue = settings[storeKey as keyof CalculatorData];
        const defaultValue = field.type === 'range' || field.type === 'number' ? 0 : '';

        let value: number | string = defaultValue;

        if (storedValue !== undefined && storedValue !== null) {
          if (field.type === 'range' || field.type === 'number') {
            const numValue = Number(storedValue);
            if (!isNaN(numValue)) {
              value = field.unit === '%' ? numValue * 100 : numValue;
            }
          } else if (field.type === 'select' || field.type === 'radio') {
            value = String(storedValue);
          }
        }

        acc[field.key] = value;
        return acc;
      }, {});

      isInitialized = true;

      // Calculate initial results
      calculateResults();
    } catch (err) {
      console.error('Error initializing form data:', err);
      error = err instanceof Error ? err.message : 'Failed to initialize';
    } finally {
      isLoading = false;
    }
  }

  // Generate input configurations for ParameterForm
  const inputs = $derived(
    inputFields.map((field: InputField) => {
      // Check if this is a select input
      if (field.type === 'select' && field.options) {
        return {
          id: field.key,
          label: field.label,
          options: field.options,
          type: 'select' as const,
          getValue: () => (formData[field.key] as string) || '',
          setValue: (val: string) => {
            if (formData[field.key] === val) return;

            formData[field.key] = val;

            // Update the store
            const storeKey = field.storeKey || field.key;
            updateStore(storeKey as keyof CalculatorData, val);
            saveAndCalculate();
          }
        };
      }

      // Check if this is a radio input
      if (field.type === 'radio' && field.options) {
        return {
          id: field.key,
          label: field.label,
          options: field.options,
          type: 'radio' as const,
          getValue: () => (formData[field.key] as string) || '',
          setValue: (val: string) => {
            if (formData[field.key] === val) return;

            formData[field.key] = val;

            // Update the store
            const storeKey = field.storeKey || field.key;
            updateStore(storeKey as keyof CalculatorData, val);
            saveAndCalculate();
          }
        };
      }

      // Default to range input
      return {
        id: field.key,
        label: field.label,
        min: field.min || 0,
        max: field.max || 100,
        step: field.step || 1,
        unit: field.unit || '',
        allowDecimals: field.allowDecimals || false,
        type: 'range' as const,
        getValue: () => (formData[field.key] as number) || 0,
        setValue: (val: number) => {
          if (formData[field.key] === val) return;

          // Format value if needed
          const formattedValue = field.allowDecimals ? val : formatValue(val);
          formData[field.key] = formattedValue;

          // Update the store
          const storeKey = field.storeKey || field.key;

          // Special case for percentage values stored as fractions
          const storeValue =
            field.unit === '%' && storeKey.includes('Fraction') && formattedValue > 1
              ? formattedValue / 100
              : formattedValue;

          updateStore(storeKey as keyof CalculatorData, storeValue);
          saveAndCalculate();
        }
      };
    })
  );

  // Helper function to save data and calculate results
  function saveAndCalculate(): void {
    if (isInitialized) {
      calculateResults();
    }
  }

  // Calculate results using the provided function
  function calculateResults(): void {
    try {
      // Reset error state
      error = null;

      // Only calculate if all required values are valid
      if (isFormDataValid()) {
        // Use the provided calculation function
        results = calculateFn(formData as Record<string, number>);
        updateTips();
      } else {
        resetResults();
      }
    } catch (err) {
      console.error('Calculation error:', err);
      error = err instanceof Error ? err.message : 'Failed to calculate results';
      resetResults();
    }
  }

  // Check if all form values are valid (greater than 0 for numbers, non-empty for strings)
  function isFormDataValid(): boolean {
    return Object.entries(formData).every(([key, value]) => {
      // Find the corresponding field definition
      const field = inputFields.find((f: InputField) => f.key === key);

      // Skip validation for select inputs - they're always valid once selected
      if (field?.type === 'select') return true;

      // Numeric inputs should be greater than 0
      return Number(value) > 0;
    });
  }

  // Reset results to defaults
  function resetResults(): void {
    results = {};
    tips = getErrorTips?.() || ['Check your input values and try again'];
  }

  // Update tips based on calculation results
  function updateTips(): void {
    tips = getTips?.({ ...formData, ...results }) || [];
  }

  // StatsComponent will be passed as a prop
  const StatsComponent = statsComponent;

  // Update store with new value
  function updateStore(key: keyof CalculatorData, value: number | string) {
    calculatorStore.updateValue(key, value);
  }
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
