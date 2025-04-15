<script lang="ts">
  import { weeklyEvChargeEstimator } from '$lib/utils/calculations';
  import { DEFAULT_VALUES, INPUT_RANGES } from '$lib/utils/constants';
  import { getFrequencyTips, getErrorTips } from '$lib/utils/tips';
  import StatsSkeleton from '$lib/components/ui/skeletons/StatsSkeleton.svelte';
  import TipsSkeleton from '$lib/components/ui/skeletons/TipsSkeleton.svelte';
  import RangeInputSkeleton from '$lib/components/ui/skeletons/RangeInputSkeleton.svelte';
  import FrequencyStats from './FrequencyStats.svelte';
  import ParameterForm from '../../ui/ParameterForm.svelte';
  import { settingsStore } from '$lib/state/SettingsStore';
  import Alert from '$lib/components/ui/Alert.svelte';
  import Tips from '$lib/components/ui/Tips.svelte';
  import { formatValue } from '$lib/utils/formatters';

  type InputConfig = {
    id: string;
    label: string;
    key: keyof typeof formData;
    min: number;
    max: number;
    step: number;
    unit: string;
    allowDecimals: boolean;
    getValue: () => number;
    setValue: (val: number) => void;
  };

  type CalculationResult = {
    effectiveRangeKm: number;
    weeklyCharges: number;
    co2Savings: number;
  };

  // Component state
  let isLoading = $state(true);
  let isInitialized = $state(false);
  let error = $state<string | null>(null);

  // Form data - initialized from the page data
  let formData = $state({
    weeklyDistanceKm: DEFAULT_VALUES.weeklyDistanceKm,
    batteryKwh: DEFAULT_VALUES.batteryKwh,
    consumptionKwhPer100km: DEFAULT_VALUES.consumptionKwhPer100km,
    usableFraction: DEFAULT_VALUES.usableFraction
  });

  // Results
  let results = $state<CalculationResult>({
    effectiveRangeKm: 0,
    weeklyCharges: 0,
    co2Savings: 0
  });

  // Tips based on parameters
  let chargingTips = $state<string[]>([]);

  // Initialize component with a setTimeout for smoother UX,
  // but using $effect instead of onMount
  $effect(() => {
    setTimeout(() => {
      initializeFromStore();
    }, 800);
  });

  // Subscribe to evSettings for updates
  settingsStore.subscribe((settings) => {
    if (isInitialized) {
      // Check which values have changed
      let hasChanges = false;

      if (formData.weeklyDistanceKm !== settings.weeklyDistanceKm) {
        formData.weeklyDistanceKm = settings.weeklyDistanceKm;
        hasChanges = true;
      }

      if (formData.batteryKwh !== settings.batteryKwh) {
        formData.batteryKwh = settings.batteryKwh;
        hasChanges = true;
      }

      if (formData.consumptionKwhPer100km !== settings.consumptionKwhPer100km) {
        formData.consumptionKwhPer100km = settings.consumptionKwhPer100km;
        hasChanges = true;
      }

      if (formData.usableFraction !== settings.usableFraction) {
        formData.usableFraction = settings.usableFraction;
        hasChanges = true;
      }

      // Recalculate results if needed
      if (hasChanges) {
        calculateResults();
      }
    }
  });

  // Define input configurations
  const inputs: InputConfig[] = [
    {
      id: 'weekly-distance',
      label: 'Weekly Distance',
      key: 'weeklyDistanceKm',
      min: INPUT_RANGES.WEEKLY_DISTANCE.MIN,
      max: INPUT_RANGES.WEEKLY_DISTANCE.MAX,
      step: INPUT_RANGES.WEEKLY_DISTANCE.STEP,
      unit: 'km',
      allowDecimals: false,
      getValue: () => formData.weeklyDistanceKm,
      setValue: (val: number) => {
        if (val === formData.weeklyDistanceKm) return;
        formData.weeklyDistanceKm = formatValue(val);
        settingsStore.update({ weeklyDistanceKm: formData.weeklyDistanceKm });
        saveAndCalculate();
      }
    },
    {
      id: 'battery-capacity',
      label: 'Battery Capacity',
      key: 'batteryKwh',
      min: INPUT_RANGES.BATTERY_CAPACITY.MIN,
      max: INPUT_RANGES.BATTERY_CAPACITY.MAX,
      step: INPUT_RANGES.BATTERY_CAPACITY.STEP,
      unit: 'kWh',
      allowDecimals: false,
      getValue: () => formData.batteryKwh,
      setValue: (val: number) => {
        if (val === formData.batteryKwh) return;
        formData.batteryKwh = formatValue(val);
        settingsStore.update({ batteryKwh: formData.batteryKwh });
        saveAndCalculate();
      }
    },
    {
      id: 'energy-consumption',
      label: 'Energy Consumption',
      key: 'consumptionKwhPer100km',
      min: INPUT_RANGES.ENERGY_CONSUMPTION.MIN,
      max: INPUT_RANGES.ENERGY_CONSUMPTION.MAX,
      step: INPUT_RANGES.ENERGY_CONSUMPTION.STEP,
      unit: 'kWh/100km',
      allowDecimals: true,
      getValue: () => formData.consumptionKwhPer100km,
      setValue: (val: number) => {
        if (val === formData.consumptionKwhPer100km) return;
        formData.consumptionKwhPer100km = val;
        settingsStore.update({ consumptionKwhPer100km: formData.consumptionKwhPer100km });
        saveAndCalculate();
      }
    },
    {
      id: 'usable-battery',
      label: 'Usable Battery',
      key: 'usableFraction',
      min: INPUT_RANGES.USABLE_BATTERY.MIN,
      max: INPUT_RANGES.USABLE_BATTERY.MAX,
      step: INPUT_RANGES.USABLE_BATTERY.STEP,
      unit: '%',
      allowDecimals: false,
      getValue: () => formData.usableFraction * 100,
      setValue: (val: number) => {
        const newValue = val / 100;
        if (newValue === formData.usableFraction) return;
        formData.usableFraction = newValue;
        settingsStore.update({ usableFraction: formData.usableFraction });
        saveAndCalculate();
      }
    }
  ];

  /**
   * Initialize component state from the evSettings store
   */
  function initializeFromStore(): void {
    try {
      // Get current settings from the store - one-time operation
      settingsStore.subscribe((settings) => {
        // Update form data with all values from the centralized store
        formData = {
          weeklyDistanceKm: settings.weeklyDistanceKm,
          batteryKwh: settings.batteryKwh,
          consumptionKwhPer100km: settings.consumptionKwhPer100km,
          usableFraction: settings.usableFraction
        };

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

  /**
   * Helper function to save data and calculate results
   */
  function saveAndCalculate(): void {
    if (isInitialized) {
      calculateResults();
    }
  }

  /**
   * Calculates the EV charging results based on the current form data
   */
  function calculateResults(): void {
    try {
      // Reset error state
      error = null;

      // Only calculate if all required values are valid numbers greater than 0
      if (isFormDataValid()) {
        results = weeklyEvChargeEstimator(formData);
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

  /**
   * Checks if all form data values are valid (greater than 0)
   */
  function isFormDataValid(): boolean {
    return (
      formData.weeklyDistanceKm > 0 &&
      formData.batteryKwh > 0 &&
      formData.consumptionKwhPer100km > 0 &&
      formData.usableFraction > 0
    );
  }

  /**
   * Resets results to default values
   */
  function resetResults(): void {
    results = {
      effectiveRangeKm: 0,
      weeklyCharges: 0,
      co2Savings: 0
    };

    // Default tips on error
    chargingTips = getErrorTips();
  }

  /**
   * Updates tips based on calculation results
   */
  function updateTips(): void {
    const calculationParams = {
      weeklyDistanceKm: formData.weeklyDistanceKm,
      batteryKwh: formData.batteryKwh,
      consumptionKwhPer100km: formData.consumptionKwhPer100km,
      usableFraction: formData.usableFraction,
      effectiveRangeKm: results.effectiveRangeKm,
      weeklyCharges: results.weeklyCharges
    };
    chargingTips = getFrequencyTips(calculationParams);
  }
</script>

{#if error}
  <Alert type="error" message={error} />
{/if}

{#if isLoading}
  <div class="grid gap-6">
    <RangeInputSkeleton />
    <StatsSkeleton />
    <TipsSkeleton />
  </div>
{:else}
  <div class="grid gap-6">
    <ParameterForm title="EV Parameters" {inputs} />
    <FrequencyStats {results} {formData} title="Frequency Results" />
    <Tips title="Charging Frequency Tips" tips={chargingTips} color="success" />
  </div>
{/if}
