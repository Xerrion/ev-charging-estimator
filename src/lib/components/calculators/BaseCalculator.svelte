<script lang="ts">
  import { settingsStore } from '$lib/state/SettingsStore';
  import { DEFAULT_VALUES, INPUT_RANGES } from '$lib/utils/constants';

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
    children
  } = $props<{
    title?: string;
    inputFields: Array<{
      id: string;
      label: string;
      key: string;
      min?: number;
      max?: number;
      step?: number;
      unit?: string;
      allowDecimals?: boolean;
      storeKey?: string;
      options?: Array<{ value: string; label: string }>;
      type?: 'select' | 'range' | 'radio';
    }>;
    calculateFn: (formData: Record<string, number>) => Record<string, any>;
    statsComponent: any;
    getTips?: (data: Record<string, any>) => string[];
    getErrorTips?: () => string[];
    children?: () => unknown;
  }>();

  // Component state
  let isLoading = $state(true);
  let isInitialized = $state(false);
  let error = $state<string | null>(null);

  // Form data and results
  let formData = $state<Record<string, number | string>>({});
  let results = $state<Record<string, any>>({});
  let tips = $state<string[]>([]);

  // Initialize with timeout for smoother UX
  $effect(() => {
    setTimeout(() => {
      initializeFromStore();
    }, 800);
  });

  // Initialize form data from settings store
  function initializeFromStore(): void {
    try {
      // One-time operation to get settings
      settingsStore.subscribe((settings) => {
        // Initialize form data with values from the store
        formData = inputFields.reduce((data: Record<string, number | string>, field: (typeof inputFields)[number]) => {
          // Use the storeKey if provided, otherwise use the field key
          const storeKey = field.storeKey || field.key;

          // Handle different field types differently
          if (field.type === 'select' || field.type === 'radio') {
            // For select/radio inputs, get the string value
            const value =
              settings[storeKey as keyof typeof settings] ??
              DEFAULT_VALUES[storeKey as keyof typeof DEFAULT_VALUES] ??
              (field.options && field.options.length > 0 ? field.options[0].value : '');

            data[field.key] = value;
          } else {
            // For numeric inputs
            const value = (settings[storeKey as keyof typeof settings] ??
              DEFAULT_VALUES[storeKey as keyof typeof DEFAULT_VALUES] ??
              0) as number;

            // Special case for percentage values stored as fractions
            if (field.unit === '%' && storeKey.includes('Fraction') && value <= 1) {
              data[field.key] = value * 100;
            } else {
              data[field.key] = value;
            }
          }

          return data;
        }, {});

        // Set initialized flag
        isInitialized = true;

        // Calculate initial results
        calculateResults();

        // Set loading to false
        isLoading = false;
      })();
    } catch (err) {
      console.error('Error initializing from settings:', err);
      error = err instanceof Error ? err.message : 'Failed to initialize';
      isLoading = false;
    }
  }

  // Generate input configurations for ParameterForm
  const inputs = $derived(
    inputFields.map((field: (typeof inputFields)[number]) => {
      // Check if this is a select input
      if (field.type === 'select' && field.options) {
        return {
          id: field.id,
          label: field.label,
          options: field.options,
          type: 'select' as const,
          getValue: () => (formData[field.key] as string) || '',
          setValue: (val: string) => {
            if (formData[field.key] === val) return;

            formData[field.key] = val;

            // Update the store
            const storeKey = field.storeKey || field.key;
            settingsStore.update({ [storeKey]: val });
            saveAndCalculate();
          }
        };
      }

      // Check if this is a radio input
      if (field.type === 'radio' && field.options) {
        return {
          id: field.id,
          label: field.label,
          options: field.options,
          type: 'radio' as const,
          getValue: () => (formData[field.key] as string) || '',
          setValue: (val: string) => {
            if (formData[field.key] === val) return;

            formData[field.key] = val;

            // Update the store
            const storeKey = field.storeKey || field.key;
            settingsStore.update({ [storeKey]: val });
            saveAndCalculate();
          }
        };
      }

      // Default to range input
      return {
        id: field.id,
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

          settingsStore.update({ [storeKey]: storeValue });
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
        results = calculateFn(formData);
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
      const field = inputFields.find((f: (typeof inputFields)[number]) => f.key === key);

      // Skip validation for select/radio inputs - they're always valid once selected
      if (field?.type === 'select' || field?.type === 'radio') return true;

      // Numeric inputs should be greater than 0
      return Number(value) > 0;
    });
  }

  // Reset results to defaults
  function resetResults(): void {
    results = {};
    tips = getErrorTips();
  }

  // Update tips based on calculation results
  function updateTips(): void {
    tips = getTips({ ...formData, ...results });
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
  <StatsComponent {results} {formData} title="Results" />
  <Tips title="Tips" {tips} color="success" />
{/if}
