<script lang="ts">
  import BaseCalculator from '$lib/components/calculators/BaseCalculator.svelte';
  import CostStats from './CostStats.svelte';
  import { INPUT_RANGES, DEFAULT_VALUES } from '$lib/utils/constants';
  import { getCostTips, getErrorTips } from '$lib/utils/tips';
  import { calculateChargingCost, calculateWeeklyCharges } from '$lib/utils/calculations';
  import { getCurrencyOptions } from '$lib/data/currencies';
  import Card from '$lib/components/ui/Card.svelte';
  import { settingsStore } from '$lib/state/SettingsStore';

  // Rate type options
  type RateType = 'flat' | 'variable';

  // State for rate type and currency
  let rateType = $state<RateType>('flat');
  let selectedCurrency = $state(DEFAULT_VALUES.selectedCurrency);
  let currencyOptions = $state(getCurrencyOptions());

  $effect(() => {
    console.log('selectedCurrency', selectedCurrency);
  });

  // Define base input fields (common for both rate types)
  const baseInputFields = [
    {
      id: 'weekly-distance',
      label: 'Weekly Distance',
      key: 'weeklyDistanceKm',
      storeKey: 'weeklyDistanceKm',
      min: INPUT_RANGES.WEEKLY_DISTANCE.MIN,
      max: INPUT_RANGES.WEEKLY_DISTANCE.MAX,
      step: INPUT_RANGES.WEEKLY_DISTANCE.STEP,
      unit: 'km',
      allowDecimals: false
    },
    {
      id: 'battery-capacity',
      label: 'Battery Capacity',
      key: 'batteryKwh',
      storeKey: 'batteryKwh',
      min: INPUT_RANGES.BATTERY_CAPACITY.MIN,
      max: INPUT_RANGES.BATTERY_CAPACITY.MAX,
      step: INPUT_RANGES.BATTERY_CAPACITY.STEP,
      unit: 'kWh',
      allowDecimals: false
    },
    {
      id: 'initial-charge',
      label: 'Initial Charge',
      key: 'initialCharge',
      storeKey: 'initialCharge',
      min: INPUT_RANGES.BATTERY_CHARGE.MIN,
      max: INPUT_RANGES.BATTERY_CHARGE.MAX,
      step: INPUT_RANGES.BATTERY_CHARGE.STEP,
      unit: '%',
      allowDecimals: false
    },
    {
      id: 'target-charge',
      label: 'Target Charge',
      key: 'targetCharge',
      storeKey: 'targetCharge',
      min: INPUT_RANGES.BATTERY_CHARGE.MIN,
      max: INPUT_RANGES.BATTERY_CHARGE.MAX,
      step: INPUT_RANGES.BATTERY_CHARGE.STEP,
      unit: '%',
      allowDecimals: false
    },
    {
      id: 'charging-efficiency',
      label: 'Charging Efficiency',
      key: 'chargingEfficiency',
      storeKey: 'chargingEfficiency',
      min: INPUT_RANGES.CHARGING_EFFICIENCY.MIN,
      max: INPUT_RANGES.CHARGING_EFFICIENCY.MAX,
      step: INPUT_RANGES.CHARGING_EFFICIENCY.STEP,
      unit: '%',
      allowDecimals: false
    },

    {
      id: 'energy-consumption',
      label: 'Energy Consumption',
      key: 'consumptionKwhPer100km',
      storeKey: 'consumptionKwhPer100km',
      min: INPUT_RANGES.ENERGY_CONSUMPTION.MIN,
      max: INPUT_RANGES.ENERGY_CONSUMPTION.MAX,
      step: INPUT_RANGES.ENERGY_CONSUMPTION.STEP,
      unit: 'kWh/100km',
      allowDecimals: true
    }
  ];

  // Add fields based on rate type
  const flatRateFields = [
    {
      id: 'electricity-rate',
      label: 'Electricity Rate',
      key: 'electricityRate',
      storeKey: 'electricityRate',
      min: INPUT_RANGES.ELECTRICITY_RATE.MIN,
      max: INPUT_RANGES.ELECTRICITY_RATE.MAX,
      step: INPUT_RANGES.ELECTRICITY_RATE.STEP,
      get unit() {
        return `${selectedCurrency}/kWh`;
      },
      allowDecimals: true
    }
  ];

  const variableRateFields = [
    {
      id: 'peak-electricity-rate',
      label: 'Peak Rate',
      key: 'peakElectricityRate',
      storeKey: 'peakElectricityRate',
      min: INPUT_RANGES.ELECTRICITY_RATE.MIN,
      max: INPUT_RANGES.ELECTRICITY_RATE.MAX,
      step: INPUT_RANGES.ELECTRICITY_RATE.STEP,
      get unit() {
        return `${selectedCurrency}/kWh`;
      },
      allowDecimals: true
    },
    {
      id: 'off-peak-electricity-rate',
      label: 'Off-Peak Rate',
      key: 'offPeakElectricityRate',
      storeKey: 'offPeakElectricityRate',
      min: INPUT_RANGES.ELECTRICITY_RATE.MIN,
      max: INPUT_RANGES.ELECTRICITY_RATE.MAX,
      step: INPUT_RANGES.ELECTRICITY_RATE.STEP,
      get unit() {
        return `${selectedCurrency}/kWh`;
      },
      allowDecimals: true
    },
    {
      id: 'off-peak-percentage',
      label: 'Off-Peak Charging',
      key: 'chargingDuringOffPeak',
      storeKey: 'chargingDuringOffPeak',
      min: 0,
      max: 100,
      step: 5,
      unit: '%',
      allowDecimals: false
    }
  ];

  // Combine field sets based on rate type
  const inputFields = $derived(() => {
    return rateType === 'flat' ? [...baseInputFields, ...flatRateFields] : [...baseInputFields, ...variableRateFields];
  });

  // Current input fields (non-derived for passing to component)
  let currentFields = $state<typeof baseInputFields>([]);

  // Update fields when rate type changes
  $effect(() => {
    currentFields =
      rateType === 'flat' ? [...baseInputFields, ...flatRateFields] : [...baseInputFields, ...variableRateFields];
  });

  // Calculate function
  function calculateResults(formData: Record<string, number>) {
    // Calculate energy needed for a single charge
    const chargeRange = formData.targetCharge - formData.initialCharge;
    const energyNeeded = (formData.batteryKwh * chargeRange) / 100;
    const energyWithEfficiency = energyNeeded / (formData.chargingEfficiency / 100);

    // Calculate effective range for weekly charges
    const effectiveRangeKm =
      (formData.batteryKwh * (formData.targetCharge - formData.initialCharge)) /
      100 /
      (formData.consumptionKwhPer100km / 100);

    // Calculate weekly charges
    const weeklyCharges = calculateWeeklyCharges({
      weeklyDistanceKm: formData.weeklyDistanceKm,
      effectiveRangeKm
    });

    // Configure charging cost calculation based on rate type
    const costParams: any = {
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
      // Flat rate calculation
      costParams.useTimeOfUseRates = false;
    }

    // Calculate costs
    const costResult = calculateChargingCost(costParams);

    // Return full results
    return {
      costPerCharge: costResult.totalCost,
      weeklyCost: costResult.totalCost * weeklyCharges,
      monthlyCost: costResult.totalCost * weeklyCharges * 4.33, // Average weeks per month
      annualCost: costResult.totalCost * weeklyCharges * 52,
      energyPerCharge: energyWithEfficiency
    };
  }

  // Handle rate type change
  function handleRateTypeChange(type: RateType): void {
    rateType = type;

    if (type === 'variable') {
      // Initialize variable rates if they're zeroed out
      settingsStore.subscribe((settings) => {
        if (settings.peakElectricityRate === 0) {
          settingsStore.update({
            peakElectricityRate: settings.electricityRate * 1.5,
            offPeakElectricityRate: settings.electricityRate * 0.7
          });
        }
      })();
    }
  }

  // Handle currency change
  function handleCurrencyChange(currency: string): void {
    selectedCurrency = currency;
    settingsStore.update({ selectedCurrency });
  }
</script>

<BaseCalculator
  title="Charging Parameters"
  inputFields={currentFields}
  calculateFn={calculateResults}
  statsComponent={CostStats}
  getTips={getCostTips}
  {getErrorTips}
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
        <select id="currency-select" class="select select-bordered w-full" bind:value={selectedCurrency}>
          {#each currencyOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
    </Card>
  </div>
</BaseCalculator>
