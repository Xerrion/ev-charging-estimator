<script lang="ts">
  import { settingsStore } from '$lib/state/SettingsStore';
  import { DEFAULT_VALUES, INPUT_RANGES } from '$lib/utils/constants';
  import ParameterForm from '$lib/components/ui/ParameterForm.svelte';
  import ParameterFormSkeleton from '$lib/components/ui/skeletons/ParameterFormSkeleton.svelte';
  import StatsSkeleton from '$lib/components/ui/skeletons/StatsSkeleton.svelte';
  import TipsSkeleton from '$lib/components/ui/skeletons/TipsSkeleton.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';
  import Tips from '$lib/components/ui/Tips.svelte';
  import { formatValue } from '$lib/utils/formatters';
  import { cubicOut } from 'svelte/easing';
  import { fade } from 'svelte/transition';

  /**
   * Custom slide and fade transition for alerts
   * @param node The HTML element to animate
   * @param params Animation parameters
   */
  function alertTransition(node: HTMLElement, { delay = 0, duration = 400 } = {}) {
    return {
      delay,
      duration,
      css: (t: number, u: number) => {
        const eased = cubicOut(t);
        return `
          transform: translateY(${u * -20}px);
          opacity: ${eased};
          height: ${eased * 100}%;
          padding-top: ${eased * 1}rem;
          padding-bottom: ${eased * 1}rem;
        `;
      }
    };
  }

  /**
   * Custom scale transition for calculator content
   * @param node The HTML element to animate
   * @param params Animation parameters
   */
  function scaleTransition(node: HTMLElement, { delay = 150, duration = 300 } = {}) {
    return {
      delay,
      duration,
      css: (t: number, u: number) => {
        const eased = cubicOut(t);
        return `
          transform-origin: center top;
          transform: scale(${eased});
          opacity: ${eased};
        `;
      }
    };
  }

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
      min: number;
      max: number;
      step: number;
      unit: string;
      allowDecimals: boolean;
      storeKey?: string;
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
  let formData = $state<Record<string, number>>({});
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
        formData = inputFields.reduce((data: Record<string, number>, field: (typeof inputFields)[number]) => {
          // Use the storeKey if provided, otherwise use the field key
          const storeKey = field.storeKey || field.key;

          // Get value from settings or use default
          const value = (settings[storeKey as keyof typeof settings] ??
            DEFAULT_VALUES[storeKey as keyof typeof DEFAULT_VALUES] ??
            0) as number;

          // Special case for percentage values stored as fractions
          if (field.unit === '%' && storeKey.includes('Fraction') && value <= 1) {
            data[field.key] = value * 100;
          } else {
            data[field.key] = value;
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
      return {
        id: field.id,
        label: field.label,
        min: field.min,
        max: field.max,
        step: field.step,
        unit: field.unit,
        allowDecimals: field.allowDecimals,
        getValue: () => formData[field.key] || 0,
        setValue: (val: number) => {
          if (formData[field.key] === val) return;

          // Format value if needed
          const formattedValue = field.allowDecimals ? val : formatValue(val);
          formData[field.key] = formattedValue;

          // Update the store
          const storeKey = field.storeKey || field.key;

          // Special case for percentage values stored as fractions
          const storeValue =
            field.unit === '%' && storeKey.includes('Fraction') ? formattedValue / 100 : formattedValue;

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

  // Check if all form values are valid (greater than 0)
  function isFormDataValid(): boolean {
    return Object.values(formData).every((value) => value > 0);
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
  <div transition:alertTransition>
    <Alert type="error" message={error} />
  </div>
{/if}

{#if isLoading}
  <div transition:fade={{ duration: 200 }}>
    <TipsSkeleton />
    <ParameterFormSkeleton rows={inputFields.length} />
    <StatsSkeleton columns={3} />
  </div>
{:else}
  <div transition:alertTransition>
    <Tips title="Tips" {tips} color="success" />
  </div>
  {@render children?.()}
  <div transition:scaleTransition>
    <ParameterForm {title} {inputs} />
    <StatsComponent {results} {formData} title="Results" />
  </div>
{/if}
