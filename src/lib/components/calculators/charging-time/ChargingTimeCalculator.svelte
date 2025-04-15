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
  import { DEFAULT_VALUES } from '$lib/utils/constants';

  // Define Result type
  type ChargingTimeResult = {
    chargingTimeHours: number;
    chargingTimeMinutes: number;
    energyNeeded: number;
    actualChargingPower: number;
    technicalLimitExceeded?: boolean;
  };

  // Component state
  let isLoading = $state(true);
  let isInitialized = $state(false);

  // Form data - will be populated from the store
  let formData = $state({
    batteryKwh: DEFAULT_VALUES.batteryKwh,
    initialCharge: DEFAULT_VALUES.initialCharge, // percent
    targetCharge: DEFAULT_VALUES.targetCharge, // percent
    chargingPower: DEFAULT_VALUES.chargingPower, // kW
    chargingEfficiency: DEFAULT_VALUES.chargingEfficiency, // percent
    temperatureC: 20, // Default to room temperature (20°C)
    phases: 3 // Default to 3-phase charging
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
      min: 20,
      max: 150,
      step: 1,
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
      min: 0,
      max: 100,
      step: 1,
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
      min: 0,
      max: 100,
      step: 1,
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
      min: 3.7,
      max: 350,
      step: 0.1,
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
      min: 70,
      max: 100,
      step: 1,
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
      min: -20,
      max: 50,
      step: 1,
      unit: '°C',
      allowDecimals: false,
      getValue: () => formData.temperatureC,
      setValue: (val: number) => {
        if (formData.temperatureC === val) return;
        formData.temperatureC = Math.round(val);
        saveAndCalculate();
      }
    },
    {
      id: 'phases',
      label: 'Charging Phases',
      min: 1,
      max: 3,
      step: 1,
      unit: '',
      allowDecimals: false,
      getValue: () => formData.phases,
      setValue: (val: number) => {
        if (formData.phases === val) return;
        formData.phases = Math.round(val);
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
          temperatureC: settings.temperatureC ?? 20, // Provide default if not in settings
          phases: settings.phases ?? 3 // Provide default if not in settings
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

<div class="flex w-full flex-col gap-6">
  {#if isLoading}
    <!-- Skeleton loading state -->
    <Card title="Charging Parameters">
      <div class="space-y-8">
        {#each Array(inputs.length) as _, i}
          <RangeInputSkeleton />
        {/each}
      </div>
    </Card>

    <div class="mt-2">
      <StatsSkeleton columns={2} />
    </div>

    <div class="mt-2">
      <TipsSkeleton />
    </div>
  {:else}
    <ParameterForm title="Charging Parameters" {inputs} />

    <ChargingTimeStats {results} {formData} />

    <Tips title="Charging Recommendations" tips={chargingTips} color="info" />
  {/if}
</div>
