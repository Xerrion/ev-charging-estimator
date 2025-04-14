<script lang="ts">
	import { weeklyEvChargeEstimator } from '$lib/utils/calculations';
	import { saveData, getData, defaultValues } from '$lib/utils/storage';
	import { INPUT_RANGES } from '$lib/utils/constants';
	import { getFrequencyTips, getErrorTips } from '$lib/utils/tips';
	import { onMount } from 'svelte';
	import RangeInputSkeleton from '$lib/components/ui/RangeInputSkeleton.svelte';
	import StatsSkeleton from '$lib/components/ui/StatsSkeleton.svelte';
	import TipsSkeleton from '$lib/components/ui/TipsSkeleton.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Tips from '$lib/components/ui/Tips.svelte';
	import EVStats from './EVStats.svelte';
	import ParameterForm from './ParameterForm.svelte';

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
	};

	// Component state
	let isLoading = $state(true);
	let isInitialized = $state(false);
	let error = $state<string | null>(null);

	// Form data
	let formData = $state({
		weeklyDistanceKm: defaultValues.weeklyDistanceKm,
		batteryKwh: defaultValues.batteryKwh,
		consumptionKwhPer100km: defaultValues.consumptionKwhPer100km,
		usableFraction: defaultValues.usableFraction
	});

	// Results
	let results = $state<CalculationResult>({
		effectiveRangeKm: 0,
		weeklyCharges: 0
	});

	// Tips based on parameters
	let chargingTips = $state<string[]>([]);

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
				formData.weeklyDistanceKm = formatValue(val, false);
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
				formData.batteryKwh = formatValue(val, false);
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
				formData.consumptionKwhPer100km = val;
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
				formData.usableFraction = val / 100;
			}
		}
	];

	// Calculate results whenever formData changes
	$effect(() => {
		if (!isInitialized) return;
		calculateResults();
	});

	// Load saved data on mount
	onMount(() => {
		loadSavedData();
	});

	/**
	 * Calculates the EV charging results based on the current form data
	 */
	function calculateResults(): void {
		try {
			// Only calculate if all required values are valid numbers greater than 0
			if (isFormDataValid()) {
				results = weeklyEvChargeEstimator(formData);
				updateTips();
			} else {
				resetResults();
			}
		} catch (err) {
			console.error('Calculation error:', err);
			resetResults();
		}

		// Save data to localStorage
		saveData(formData);
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
			weeklyCharges: 0
		};

		// Default tips on error
		chargingTips = getErrorTips();
	}

	/**
	 * Loads saved data from localStorage
	 */
	function loadSavedData(): void {
		try {
			// Simulate a short loading time for smoother UX
			setTimeout(() => {
				const savedData = getData();

				// Update the formData with saved values
				formData = {
					weeklyDistanceKm: savedData.weeklyDistanceKm,
					batteryKwh: savedData.batteryKwh,
					consumptionKwhPer100km: savedData.consumptionKwhPer100km,
					usableFraction: savedData.usableFraction
				};

				// Set initialized flag to true to allow $effect to run calculations
				isInitialized = true;

				// Force an initial calculation
				calculateResults();

				// Set loading to false after everything is initialized
				isLoading = false;
			}, 800); // Short delay for smooth transition
		} catch (err) {
			console.error('Error loading saved data:', err);
			error = err instanceof Error ? err.message : 'Failed to load saved data';
			isInitialized = true;
			isLoading = false;
		}
	}

	/**
	 * Formats a value based on whether decimals are allowed
	 */
	function formatValue(value: number, allowDecimals: boolean = false): number {
		if (allowDecimals) {
			// For decimals, round to 1 decimal place
			return parseFloat(value.toFixed(1));
		}
		return Math.round(value);
	}

	/**
	 * Update tips based on input parameters and results
	 */
	function updateTips(): void {
		chargingTips = getFrequencyTips({
			weeklyDistanceKm: formData.weeklyDistanceKm,
			batteryKwh: formData.batteryKwh,
			consumptionKwhPer100km: formData.consumptionKwhPer100km,
			usableFraction: formData.usableFraction,
			effectiveRangeKm: results.effectiveRangeKm,
			weeklyCharges: results.weeklyCharges
		});
	}
</script>

<div class="flex w-full flex-col gap-6">
	{#if isLoading}
		<!-- Loading state -->
		<Card title="EV Parameters">
			<div class="space-y-6">
				{#each Array(inputs.length) as _, i}
					<RangeInputSkeleton />
				{/each}
			</div>
		</Card>

		<StatsSkeleton />
		<TipsSkeleton />
	{:else if error}
		<!-- Error state -->
		<div class="alert alert-error shadow-lg">
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 flex-shrink-0 stroke-current"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span>{error}</span>
			</div>
		</div>
	{:else}
		<ParameterForm {inputs} />

		<EVStats {results} {formData} />

		<Tips title="Charging Frequency Tips" tips={chargingTips} color="success" />
	{/if}
</div>
