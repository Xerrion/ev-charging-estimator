<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import RangeInputSkeleton from '$lib/components/ui/skeletons/RangeInputSkeleton.svelte';
  import StatsSkeleton from '$lib/components/ui/skeletons/StatsSkeleton.svelte';
  import TipsSkeleton from '$lib/components/ui/skeletons/TipsSkeleton.svelte';
  import Tips from '$lib/components/ui/Tips.svelte';
  import { getChargingTimeTips, getErrorTips } from '$lib/utils/tips';
  import { settingsStore } from '$lib/state/SettingsStore';
  import ParameterForm from '$lib/components/ui/ParameterForm.svelte';
  import ChargingTimeStats from './ChargingTimeStats.svelte';
  import { calculateChargingTime } from '$lib/utils/calculations';
  import { DEFAULT_VALUES, INPUT_RANGES } from '$lib/utils/constants';
  import Alert from '$lib/components/ui/Alert.svelte';

  // Define Result type
  type ChargingTimeResult = {
    chargingTimeHours: number;
    chargingTimeMinutes: number;
    energyNeeded: number;
    actualChargingPower: number;
    technicalLimitExceeded?: boolean;
    limitingFactor?: 'c-rate' | 'phases' | 'temperature' | null;
  };

  // Component state
  let isLoading = $state(true);
  let isInitialized = $state(false);
  let error = $state<string | null>(null);

  // Form data - will be populated from the store
  let formData = $state({
    batteryKwh: DEFAULT_VALUES.batteryKwh,
    initialCharge: DEFAULT_VALUES.initialCharge, // percent
    targetCharge: DEFAULT_VALUES.targetCharge, // percent
    chargingPower: DEFAULT_VALUES.chargingPower, // kW
    chargingEfficiency: DEFAULT_VALUES.chargingEfficiency, // percent
    temperatureC: DEFAULT_VALUES.temperatureC, // Default to room temperature (20°C)
    phases: DEFAULT_VALUES.phases // Default to 3-phase charging
  });

  // Results
  let results = $state<ChargingTimeResult>({
    chargingTimeHours: 0,
    chargingTimeMinutes: 0,
    energyNeeded: 0,
    actualChargingPower: 0
  });

  // Tips based on parameters
  let chargingTips = $state<string[]>([]);

  // Initialize component with a setTimeout for smoother UX
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

      if (formData.batteryKwh !== settings.batteryKwh) {
        formData.batteryKwh = settings.batteryKwh;
        hasChanges = true;
      }

      if (formData.initialCharge !== settings.initialCharge) {
        formData.initialCharge = settings.initialCharge;
        hasChanges = true;
      }

      if (formData.targetCharge !== settings.targetCharge) {
        formData.targetCharge = settings.targetCharge;
        hasChanges = true;
      }

      if (formData.chargingPower !== settings.chargingPower) {
        formData.chargingPower = settings.chargingPower;
        hasChanges = true;
      }

      if (formData.chargingEfficiency !== settings.chargingEfficiency) {
        formData.chargingEfficiency = settings.chargingEfficiency;
        hasChanges = true;
      }

      if (formData.temperatureC !== settings.temperatureC) {
        formData.temperatureC = settings.temperatureC;
        hasChanges = true;
      }

      if (formData.phases !== settings.phases) {
        formData.phases = settings.phases;
        hasChanges = true;
      }

      // Recalculate results if needed
      if (hasChanges) {
        calculateResults();
      }
    }
  });

  // Define input configurations
  const inputs = [
    {
      id: 'battery-capacity',
      label: 'Battery Capacity',
      min: INPUT_RANGES.BATTERY_CAPACITY.MIN,
      max: INPUT_RANGES.BATTERY_CAPACITY.MAX,
      step: INPUT_RANGES.BATTERY_CAPACITY.STEP,
      unit: 'kWh',
      allowDecimals: false,
      getValue: () => formData.batteryKwh,
      setValue: (val: number) => {
        if (formData.batteryKwh === val) return;
        formData.batteryKwh = Math.round(val);
        settingsStore.update({ batteryKwh: formData.batteryKwh });
        saveAndCalculate();
      }
    },
    {
      id: 'initial-charge',
      label: 'Initial Charge',
      min: INPUT_RANGES.BATTERY_CHARGE.MIN,
      max: INPUT_RANGES.BATTERY_CHARGE.MAX,
      step: INPUT_RANGES.BATTERY_CHARGE.STEP,
      unit: '%',
      allowDecimals: false,
      getValue: () => formData.initialCharge,
      setValue: (val: number) => {
        if (formData.initialCharge === val) return;
        formData.initialCharge = Math.round(val);
        settingsStore.update({ initialCharge: formData.initialCharge });
        saveAndCalculate();
      }
    },
    {
      id: 'target-charge',
      label: 'Target Charge',
      min: INPUT_RANGES.BATTERY_CHARGE.MIN,
      max: INPUT_RANGES.BATTERY_CHARGE.MAX,
      step: INPUT_RANGES.BATTERY_CHARGE.STEP,
      unit: '%',
      allowDecimals: false,
      getValue: () => formData.targetCharge,
      setValue: (val: number) => {
        if (formData.targetCharge === val) return;
        formData.targetCharge = Math.round(val);
        settingsStore.update({ targetCharge: formData.targetCharge });
        saveAndCalculate();
      }
    },
    {
      id: 'charging-power',
      label: 'Charging Power',
      min: INPUT_RANGES.CHARGING_POWER.MIN,
      max: INPUT_RANGES.CHARGING_POWER.MAX,
      step: INPUT_RANGES.CHARGING_POWER.STEP,
      unit: 'kW',
      allowDecimals: true,
      getValue: () => formData.chargingPower,
      setValue: (val: number) => {
        if (formData.chargingPower === val) return;
        formData.chargingPower = val;
        settingsStore.update({ chargingPower: formData.chargingPower });
        saveAndCalculate();
      }
    },
    {
      id: 'charging-efficiency',
      label: 'Charging Efficiency',
      min: INPUT_RANGES.CHARGING_EFFICIENCY.MIN,
      max: INPUT_RANGES.CHARGING_EFFICIENCY.MAX,
      step: INPUT_RANGES.CHARGING_EFFICIENCY.STEP,
      unit: '%',
      allowDecimals: false,
      getValue: () => formData.chargingEfficiency,
      setValue: (val: number) => {
        if (formData.chargingEfficiency === val) return;
        formData.chargingEfficiency = Math.round(val);
        settingsStore.update({ chargingEfficiency: formData.chargingEfficiency });
        saveAndCalculate();
      }
    },
    {
      id: 'temperature',
      label: 'Battery Temperature',
      min: INPUT_RANGES.TEMPERATURE.MIN,
      max: INPUT_RANGES.TEMPERATURE.MAX,
      step: INPUT_RANGES.TEMPERATURE.STEP,
      unit: '°C',
      allowDecimals: false,
      getValue: () => formData.temperatureC,
      setValue: (val: number) => {
        if (formData.temperatureC === val) return;
        formData.temperatureC = Math.round(val);
        settingsStore.update({ temperatureC: formData.temperatureC });
        saveAndCalculate();
      }
    },
    {
      id: 'phases',
      label: 'Charging Phases',
      min: INPUT_RANGES.PHASES.MIN,
      max: INPUT_RANGES.PHASES.MAX,
      step: INPUT_RANGES.PHASES.STEP,
      unit: '',
      allowDecimals: false,
      getValue: () => formData.phases,
      setValue: (val: number) => {
        if (formData.phases === val) return;
        formData.phases = Math.round(val);
        settingsStore.update({ phases: formData.phases });
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
          batteryKwh: settings.batteryKwh,
          initialCharge: settings.initialCharge,
          targetCharge: settings.targetCharge,
          chargingPower: settings.chargingPower,
          chargingEfficiency: settings.chargingEfficiency,
          temperatureC: settings.temperatureC ?? DEFAULT_VALUES.temperatureC, // Provide default if not in settings
          phases: settings.phases ?? DEFAULT_VALUES.phases // Provide default if not in settings
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
      error = err instanceof Error ? err.message : 'Failed to initialize settings';
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
   * Calculate charging time and energy needed
   */
  function calculateResults(): void {
    try {
      // Reset error state
      error = null;

      // Use the utility function to calculate results
      results = calculateChargingTime({
        batteryKwh: formData.batteryKwh,
        initialCharge: formData.initialCharge,
        targetCharge: formData.targetCharge,
        chargingPower: formData.chargingPower,
        chargingEfficiency: formData.chargingEfficiency,
        temperatureC: formData.temperatureC,
        phases: formData.phases
      });

      // Update tips based on parameters
      updateTips();
    } catch (err) {
      console.error('Calculation error:', err);
      error = err instanceof Error ? err.message : 'Failed to calculate results';

      // Reset results on error
      results = {
        chargingTimeHours: 0,
        chargingTimeMinutes: 0,
        energyNeeded: 0,
        actualChargingPower: 0
      };

      // Default tips on error
      chargingTips = getErrorTips();
    }
  }

  /**
   * Update tips based on input parameters
   */
  function updateTips(): void {
    chargingTips = getChargingTimeTips({
      batteryKwh: formData.batteryKwh,
      initialCharge: formData.initialCharge,
      targetCharge: formData.targetCharge,
      chargingPower: formData.chargingPower,
      chargingEfficiency: formData.chargingEfficiency,
      temperatureC: formData.temperatureC,
      phases: formData.phases,
      chargingTimeHours: results.chargingTimeHours,
      chargingTimeMinutes: results.chargingTimeMinutes,
      actualChargingPower: results.actualChargingPower,
      limitingFactor: results.limitingFactor
    });
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
    <ParameterForm title="Charging Parameters" {inputs} />
    <ChargingTimeStats {results} {formData} title="Charging Results" />
    <Tips title="Charging Recommendations" tips={chargingTips} color="info" />
  </div>
{/if}
