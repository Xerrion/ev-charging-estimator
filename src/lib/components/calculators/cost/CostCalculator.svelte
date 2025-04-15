<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import RangeInputSkeleton from '$lib/components/ui/skeletons/RangeInputSkeleton.svelte';
  import StatsSkeleton from '$lib/components/ui/skeletons/StatsSkeleton.svelte';
  import TipsSkeleton from '$lib/components/ui/skeletons/TipsSkeleton.svelte';
  import Tips from '$lib/components/ui/Tips.svelte';
  import { getCostTips, getErrorTips } from '$lib/utils/tips';
  import { settingsStore } from '$lib/state/SettingsStore';
  import ParameterForm from '$lib/components/ui/ParameterForm.svelte';
  import CostStats from './CostStats.svelte';
  import { calculateChargingCost, generateCostStats } from '$lib/utils/calculations';
  import { DEFAULT_VALUES, INPUT_RANGES } from '$lib/utils/constants';
  import { getCurrencyOptions } from '$lib/data/currencies';
  import Alert from '$lib/components/ui/Alert.svelte';
  import { calculateWeeklyCharges } from '$lib/utils/calculations';

  // Define Result type
  type CostCalculationResult = {
    costPerCharge: number;
    weeklyCost: number;
    monthlyCost: number;
    annualCost: number;
    energyPerCharge: number;
  };

  // Rate type options
  type RateType = 'flat' | 'variable';

  // Component state
  let isLoading = $state(true);
  let isInitialized = $state(false);
  let error = $state<string | null>(null);

  // Form data - will be populated from the store
  let formData = $state({
    batteryKwh: DEFAULT_VALUES.batteryKwh,
    initialCharge: DEFAULT_VALUES.initialCharge, // percent
    targetCharge: DEFAULT_VALUES.targetCharge, // percent
    electricityRate: DEFAULT_VALUES.electricityRate, // Default electricity rate per kWh
    peakElectricityRate: DEFAULT_VALUES.peakElectricityRate, // Default peak electricity rate per kWh
    offPeakElectricityRate: DEFAULT_VALUES.offPeakElectricityRate, // Default off-peak electricity rate per kWh
    chargingDuringOffPeak: DEFAULT_VALUES.chargingDuringOffPeak, // Default percentage of charging during off-peak hours
    chargingEfficiency: DEFAULT_VALUES.chargingEfficiency, // percent
    weeklyDistanceKm: DEFAULT_VALUES.weeklyDistanceKm, // Weekly distance in km
    consumptionKwhPer100km: DEFAULT_VALUES.consumptionKwhPer100km // kWh per 100 km
  });

  // Rate selection
  let rateType = $state<RateType>('flat');

  // Currency
  let selectedCurrency = $state(DEFAULT_VALUES.selectedCurrency);

  // Results
  let results = $state<CostCalculationResult>({
    costPerCharge: 0,
    weeklyCost: 0,
    monthlyCost: 0,
    annualCost: 0,
    energyPerCharge: 0
  });

  // Tips based on parameters
  let costTips = $state<string[]>([]);

  // UI options
  let currencyOptions = $state(getCurrencyOptions());

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

      if (formData.chargingEfficiency !== settings.chargingEfficiency) {
        formData.chargingEfficiency = settings.chargingEfficiency;
        hasChanges = true;
      }

      if (formData.weeklyDistanceKm !== settings.weeklyDistanceKm) {
        formData.weeklyDistanceKm = settings.weeklyDistanceKm;
        hasChanges = true;
      }

      if (formData.consumptionKwhPer100km !== settings.consumptionKwhPer100km) {
        formData.consumptionKwhPer100km = settings.consumptionKwhPer100km;
        hasChanges = true;
      }

      // Recalculate results if needed
      if (hasChanges) {
        calculateResults();
      }
    }
  });

  // Define input configurations
  const baseInputs = [
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
      id: 'electricity-rate',
      label: 'Electricity Rate',
      min: INPUT_RANGES.ELECTRICITY_RATE.MIN,
      max: INPUT_RANGES.ELECTRICITY_RATE.MAX,
      step: INPUT_RANGES.ELECTRICITY_RATE.STEP,
      unit: `${selectedCurrency}/kWh`,
      allowDecimals: true,
      getValue: () => formData.electricityRate,
      setValue: (val: number) => {
        if (formData.electricityRate === val) return;
        formData.electricityRate = val;
        settingsStore.update({ electricityRate: formData.electricityRate });
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
      id: 'weekly-distance',
      label: 'Weekly Distance',
      min: INPUT_RANGES.WEEKLY_DISTANCE.MIN,
      max: INPUT_RANGES.WEEKLY_DISTANCE.MAX,
      step: INPUT_RANGES.WEEKLY_DISTANCE.STEP,
      unit: 'km',
      allowDecimals: false,
      getValue: () => formData.weeklyDistanceKm,
      setValue: (val: number) => {
        if (formData.weeklyDistanceKm === val) return;
        formData.weeklyDistanceKm = Math.round(val);
        settingsStore.update({ weeklyDistanceKm: formData.weeklyDistanceKm });
        saveAndCalculate();
      }
    },
    {
      id: 'energy-consumption',
      label: 'Energy Consumption',
      min: INPUT_RANGES.ENERGY_CONSUMPTION.MIN,
      max: INPUT_RANGES.ENERGY_CONSUMPTION.MAX,
      step: INPUT_RANGES.ENERGY_CONSUMPTION.STEP,
      unit: 'kWh/100km',
      allowDecimals: true,
      getValue: () => formData.consumptionKwhPer100km,
      setValue: (val: number) => {
        if (formData.consumptionKwhPer100km === val) return;
        formData.consumptionKwhPer100km = val;
        settingsStore.update({ consumptionKwhPer100km: formData.consumptionKwhPer100km });
        saveAndCalculate();
      }
    }
  ];

  // Make inputs reactive to currency changes
  const inputs = $derived(
    baseInputs.map((input) => {
      if (input.id === 'electricity-rate') {
        return { ...input, unit: `${selectedCurrency}/kWh` };
      }
      return input;
    })
  );

  // Additional inputs for variable rate pricing
  const baseVariableRateInputs = [
    {
      id: 'peak-electricity-rate',
      label: 'Peak Rate',
      min: INPUT_RANGES.ELECTRICITY_RATE.MIN,
      max: INPUT_RANGES.ELECTRICITY_RATE.MAX,
      step: INPUT_RANGES.ELECTRICITY_RATE.STEP,
      unit: `${selectedCurrency}/kWh`,
      allowDecimals: true,
      getValue: () => formData.peakElectricityRate,
      setValue: (val: number) => {
        if (formData.peakElectricityRate === val) return;
        formData.peakElectricityRate = val;
        settingsStore.update({ peakElectricityRate: formData.peakElectricityRate });
        saveAndCalculate();
      }
    },
    {
      id: 'off-peak-electricity-rate',
      label: 'Off-Peak Rate',
      min: INPUT_RANGES.ELECTRICITY_RATE.MIN,
      max: INPUT_RANGES.ELECTRICITY_RATE.MAX,
      step: INPUT_RANGES.ELECTRICITY_RATE.STEP,
      unit: `${selectedCurrency}/kWh`,
      allowDecimals: true,
      getValue: () => formData.offPeakElectricityRate,
      setValue: (val: number) => {
        if (formData.offPeakElectricityRate === val) return;
        formData.offPeakElectricityRate = val;
        settingsStore.update({ offPeakElectricityRate: formData.offPeakElectricityRate });
        saveAndCalculate();
      }
    },
    {
      id: 'off-peak-percentage',
      label: 'Off-Peak Charging',
      min: 0,
      max: 100,
      step: 5,
      unit: '%',
      allowDecimals: false,
      getValue: () => formData.chargingDuringOffPeak,
      setValue: (val: number) => {
        if (formData.chargingDuringOffPeak === val) return;
        formData.chargingDuringOffPeak = val;
        settingsStore.update({ chargingDuringOffPeak: formData.chargingDuringOffPeak });
        saveAndCalculate();
      }
    }
  ];

  // Make variable rate inputs reactive to currency changes
  const variableRateInputs = $derived(
    baseVariableRateInputs.map((input) => {
      if (input.id === 'peak-electricity-rate' || input.id === 'off-peak-electricity-rate') {
        return { ...input, unit: `${selectedCurrency}/kWh` };
      }
      return input;
    })
  );

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
          electricityRate: settings.electricityRate,
          peakElectricityRate: settings.peakElectricityRate,
          offPeakElectricityRate: settings.offPeakElectricityRate,
          chargingDuringOffPeak: settings.chargingDuringOffPeak,
          chargingEfficiency: settings.chargingEfficiency,
          weeklyDistanceKm: settings.weeklyDistanceKm,
          consumptionKwhPer100km: settings.consumptionKwhPer100km
        };

        // Initialize currency from settings
        selectedCurrency = settings.selectedCurrency;

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
   * Calculate weekly charges based on vehicle range and weekly distance
   */
  function getWeeklyCharges(): number {
    // Calculate effective range based on battery capacity and consumption
    const effectiveRangeKm =
      (formData.batteryKwh * (formData.targetCharge - formData.initialCharge)) /
      100 /
      (formData.consumptionKwhPer100km / 100);

    // Use utility function to calculate weekly charges
    return calculateWeeklyCharges({
      weeklyDistanceKm: formData.weeklyDistanceKm,
      effectiveRangeKm
    });
  }

  /**
   * Calculates the EV charging cost results based on the current form data
   */
  function calculateResults(): void {
    try {
      error = null;
      if (!isFormDataValid()) return resetResults();

      // Get weekly charges
      const weeklyCharges = getWeeklyCharges();

      // Calculate energy needed for a single charge
      const chargeRange = formData.targetCharge - formData.initialCharge;
      const energyNeeded = (formData.batteryKwh * chargeRange) / 100;
      const energyWithEfficiency = energyNeeded / (formData.chargingEfficiency / 100);

      // Configure charging cost calculation based on rate type
      let costParams: any = {
        energyNeededKwh: energyWithEfficiency,
        baseElectricityRate: formData.electricityRate,
        includeFees: false,
        fixedFee: 0,
        taxRate: 0
      };

      if (rateType === 'variable') {
        // Variable rate calculation
        costParams.useTimeOfUseRates = true;
        costParams.peakRate = formData.peakElectricityRate;
        costParams.offPeakRate = formData.offPeakElectricityRate;
        costParams.chargingDuringOffPeak = formData.chargingDuringOffPeak;
      } else {
        // Flat rate calculation (just use the base rate)
        costParams.useTimeOfUseRates = false;
      }

      // Calculate costs with the charging cost function
      const costResult = calculateChargingCost(costParams);

      // Set our results in the format we need
      results = {
        costPerCharge: costResult.totalCost,
        weeklyCost: costResult.totalCost * weeklyCharges,
        monthlyCost: costResult.totalCost * weeklyCharges * 4.33, // Average weeks per month
        annualCost: costResult.totalCost * weeklyCharges * 52,
        energyPerCharge: energyWithEfficiency
      };

      // Update tips
      updateTips();
    } catch (err) {
      console.error('Calculation error:', err);
      error = err instanceof Error ? err.message : 'Failed to calculate results';
      resetResults();
    }
  }

  /**
   * Checks if all form data values are valid
   */
  function isFormDataValid(): boolean {
    return (
      formData.batteryKwh > 0 &&
      formData.initialCharge >= 0 &&
      formData.targetCharge > 0 &&
      formData.initialCharge < formData.targetCharge &&
      formData.electricityRate > 0 &&
      formData.chargingEfficiency > 0 &&
      formData.weeklyDistanceKm > 0 &&
      formData.consumptionKwhPer100km > 0
    );
  }

  /**
   * Resets results to default values
   */
  function resetResults(): void {
    results = {
      costPerCharge: 0,
      weeklyCost: 0,
      monthlyCost: 0,
      annualCost: 0,
      energyPerCharge: 0
    };

    // Default tips on error
    updateTips();
  }

  /**
   * Update tips based on current parameters
   */
  function updateTips(): void {
    if (error) {
      costTips = getErrorTips();
    } else {
      costTips = getCostTips();
    }
  }

  // Handle currency change
  function handleCurrencyChange(currency: string): void {
    selectedCurrency = currency;
    settingsStore.update({ selectedCurrency });
    calculateResults();
  }

  // Handle rate type change
  function handleRateTypeChange(type: RateType): void {
    rateType = type;

    if (type === 'variable') {
      // Initialize variable rates if needed
      if (formData.peakElectricityRate === 0) {
        formData.peakElectricityRate = formData.electricityRate * 1.5;
        formData.offPeakElectricityRate = formData.electricityRate * 0.7;
      }
    }

    calculateResults();
  }
</script>

{#if error}
  <Alert type="error" message={error} />
{/if}

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
    <select
      id="currency-select"
      class="select select-bordered w-full"
      value={selectedCurrency}
      onchange={(event) => {
        const target = event.target as HTMLSelectElement;
        handleCurrencyChange(target.value);
      }}
    >
      {#each currencyOptions as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>
</Card>

<!-- Loading state -->
{#if isLoading}
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <RangeInputSkeleton />
    <StatsSkeleton />
    <TipsSkeleton />
  </div>
{:else}
  <CostStats {results} currency={selectedCurrency} title="Cost Results" />

  <!-- Vehicle & Battery Parameters -->
  <ParameterForm title="Vehicle Parameters" inputs={inputs.filter((input) => input.id !== 'electricity-rate')} />

  <!-- Flat Rate Parameters if selected -->
  {#if rateType === 'flat'}
    <div class="mt-6">
      <ParameterForm title="Flat Rate Parameters" inputs={inputs.filter((input) => input.id === 'electricity-rate')} />
    </div>
  {/if}

  <!-- Variable Rate Parameters if selected -->
  {#if rateType === 'variable'}
    <div class="mt-6">
      <ParameterForm title="Variable Rate Parameters" inputs={variableRateInputs} />
    </div>
  {/if}

  <!-- Tips section -->
  <Tips title="Cost Saving Tips" tips={costTips} color="accent" />
{/if}
