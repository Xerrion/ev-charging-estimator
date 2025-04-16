<script lang="ts">
  import { calculatorStore } from '$lib/state/CalculatorStore';
  import type { CalculatorData, FormData, InputField, CalculatorProps, CalculatorResults } from '$lib/types';
  import { get } from 'svelte/store';
  import { formatValue } from '$lib/utils/formatters';
  import Alert from '../ui/Alert.svelte';
  import ParameterForm from '../ui/ParameterForm.svelte';
  import ParameterFormSkeleton from '../ui/skeletons/ParameterFormSkeleton.svelte';
  import StatsSkeleton from '../ui/skeletons/StatsSkeleton.svelte';
  import TipsSkeleton from '../ui/skeletons/TipsSkeleton.svelte';
  import Tips from '../ui/Tips.svelte';
  import { DEFAULT_VALUES } from '$lib/utils/constants';

  // Configurable props
  let {
    title = 'Calculator',
    inputFields = [],
    calculateFn,
    statsComponent,
    getTips = () => [],
    getErrorTips = () => ['Check your input values and try again'],
    children = undefined,
    currency = undefined
  } = $props();

  // Component state
  let isLoading = $state(true);
  let isInitialized = $state(false);
  let error = $state<string | null>(null);

  // Form data and results
  let formData = $state<FormData>({});
  let results = $state<CalculatorResults>({});
  let tips = $state<string[]>([]);
  let settings = $state<CalculatorData>(DEFAULT_VALUES.CALCULATOR);

  // Initialize with timeout for smoother UX
  $effect(() => {
    setTimeout(() => {
      initializeFromStore();
    }, 1000);
  });

  // Initialize form data from calculator store
  function initializeFromStore(): void {
    try {
      isLoading = true;
      settings = get(calculatorStore);

      formData = inputFields.reduce((acc: FormData, field: InputField) => {
        const storeKey = field.storeKey || field.key;
        const storedValue = settings[storeKey as keyof CalculatorData];

        let value: number | string;

        if (storedValue !== undefined && storedValue !== null) {
          if (field.type === 'range' || field.type === 'number') {
            const numValue = Number(storedValue);
            if (!isNaN(numValue)) {
              // Convert fraction to percentage for usable battery
              if (field.key === 'usableFraction') {
                value = numValue * 100;
              } else {
                value = numValue;
              }
            } else {
              value = field.type === 'range' || field.type === 'number' ? 0 : '';
            }
          } else if (field.type === 'select' || field.type === 'radio') {
            value = String(storedValue);
          } else {
            value = storedValue;
          }
        } else {
          value = field.type === 'range' || field.type === 'number' ? 0 : '';
        }

        acc[field.key] = value;
        return acc;
      }, {});

      isInitialized = true;

      if (isFormDataValid()) {
        calculateResults();
      }
    } catch (err) {
      console.error('Error initializing form data:', err);
      error = err instanceof Error ? err.message : 'Failed to initialize';
    } finally {
      isLoading = false;
    }
  }

  // Update store with new value
  function updateStore(key: keyof CalculatorData, value: number | string) {
    // Get current store value first
    const currentValue = get(calculatorStore)[key];

    // Convert percentage to fraction for usable battery before comparing
    if (key === 'usableFraction') {
      const newValue = Number(value) / 100;
      if (currentValue !== newValue) {
        calculatorStore.updateValue(key, newValue);
      }
    } else if (currentValue !== value) {
      calculatorStore.updateValue(key, value);
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
          const formattedValue = field.allowDecimals ? val : formatValue(val);

          if (formData[field.key] === formattedValue) return;
          formData[field.key] = formattedValue;

          const storeKey = field.storeKey || field.key;

          // Convert percentage to fraction for usable battery
          const storeValue = field.key === 'usableFraction' ? formattedValue / 100 : formattedValue;

          updateStore(storeKey as keyof CalculatorData, storeValue);
          saveAndCalculate();
        }
      };
    })
  );

  // Helper function to save data and calculate results
  function saveAndCalculate(): void {
    if (isInitialized && isFormDataValid()) {
      calculateResults();
    }
  }

  // Calculate results using the provided function
  function calculateResults(): void {
    try {
      error = null;

      // Only calculate if all required values are valid
      if (isFormDataValid()) {
        // Convert usableFraction to decimal for calculation
        const calculationData = { ...formData };
        if ('usableFraction' in calculationData) {
          calculationData.usableFraction = Number(calculationData.usableFraction) / 100;
        }

        // Use the provided calculation function
        results = calculateFn(calculationData as Record<string, number>);
        updateTips();
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
