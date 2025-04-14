<script lang="ts">
	import { onMount } from 'svelte';
	import RangeInput from '$lib/components/ui/RangeInput.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import RangeInputSkeleton from '$lib/components/ui/skeletons/RangeInputSkeleton.svelte';
	import StatsSkeleton from '$lib/components/ui/skeletons/StatsSkeleton.svelte';
	import Stats from '$lib/components/ui/Stats.svelte';
	import Tips from '$lib/components/ui/Tips.svelte';
	import { saveData, getData } from '$lib/utils/storage';
	import { getChargingTimeTips, getErrorTips } from '$lib/utils/tips';
	import { batteryCapacityStore, updateBatteryCapacity } from '$lib/state/battery';

	// Component state
	let isLoading = $state(true);
	let isInitialized = $state(false);

	// Form data
	let formData = $state({
		batteryKwh: getData().batteryKwh,
		initialCharge: 20, // percent
		targetCharge: 80, // percent
		chargingPower: 11, // kW
		chargingEfficiency: 90 // percent
	});

	// Results
	let results = $state({
		chargingTimeHours: 0,
		chargingTimeMinutes: 0,
		energyNeeded: 0
	});

	// Tips based on parameters
	let chargingTips = $state<string[]>([]);

	// Define stat item type
	type StatItem = {
		title: string;
		value: number | string;
		unit?: string;
		description?: string;
		color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
	};

	// Stats data
	let stats = $state<StatItem[]>([]);

	// Subscribe to the batteryCapacityStore for updates
	batteryCapacityStore.subscribe((value) => {
		if (isInitialized && formData.batteryKwh !== value) {
			formData.batteryKwh = value;
			calculateResults();
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
				formData.batteryKwh = Math.round(val);
				updateBatteryCapacity(formData.batteryKwh);
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
				formData.initialCharge = Math.round(val);
				saveData({ initialCharge: formData.initialCharge });
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
				formData.targetCharge = Math.round(val);
				saveData({ targetCharge: formData.targetCharge });
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
				formData.chargingPower = val;
				saveData({ chargingPower: formData.chargingPower });
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
				formData.chargingEfficiency = Math.round(val);
				saveData({ chargingEfficiency: formData.chargingEfficiency });
				saveAndCalculate();
			}
		}
	];

	// Load initial data from localStorage and sync with global state
	onMount(() => {
		setTimeout(() => {
			// Load saved data from localStorage
			const savedData = getData();

			// Update form data with saved values
			formData = {
				batteryKwh: savedData.batteryKwh,
				initialCharge: savedData.initialCharge,
				targetCharge: savedData.targetCharge,
				chargingPower: savedData.chargingPower,
				chargingEfficiency: savedData.chargingEfficiency
			};

			// Set initialized flag
			isInitialized = true;

			// Calculate initial results
			calculateResults();

			// Set loading to false
			isLoading = false;
		}, 800);
	});

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
			// Calculate energy needed
			const energyToCharge =
				(formData.batteryKwh * (formData.targetCharge - formData.initialCharge)) / 100;

			// Apply charging efficiency
			const energyWithEfficiency = energyToCharge / (formData.chargingEfficiency / 100);

			// Calculate charging time in hours
			const chargingTimeHours = energyWithEfficiency / formData.chargingPower;

			// Convert to hours and minutes
			const hours = Math.floor(chargingTimeHours);
			const minutes = Math.round((chargingTimeHours - hours) * 60);

			// Update results
			results = {
				chargingTimeHours: hours,
				chargingTimeMinutes: minutes,
				energyNeeded: Number(energyWithEfficiency.toFixed(2))
			};

			// Update stats
			updateStats();

			// Update tips based on parameters
			updateTips();
		} catch (err) {
			console.error('Calculation error:', err);

			// Reset results on error
			results = {
				chargingTimeHours: 0,
				chargingTimeMinutes: 0,
				energyNeeded: 0
			};

			// Update stats
			updateStats();

			// Default tips on error
			chargingTips = getErrorTips();
		}
	}

	/**
	 * Format time for display
	 */
	function formatTime(hours: number, minutes: number): string {
		if (hours === 0 && minutes === 0) return 'N/A';

		const hoursText = hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''}` : '';
		const minutesText = minutes > 0 ? `${minutes} minute${minutes !== 1 ? 's' : ''}` : '';

		if (hours > 0 && minutes > 0) {
			return `${hoursText} and ${minutesText}`;
		}

		return hoursText || minutesText;
	}

	/**
	 * Update the stats array based on current results
	 */
	function updateStats(): void {
		stats = [
			{
				title: 'Charging Time',
				value:
					results.chargingTimeHours > 0
						? results.chargingTimeHours
						: results.chargingTimeMinutes > 0
							? '<1'
							: 'N/A',
				unit: ' hr',
				description: formatTime(results.chargingTimeHours, results.chargingTimeMinutes),
				color: 'primary'
			},
			{
				title: 'Energy Required',
				value: results.energyNeeded,
				unit: ' kWh',
				description: `${formData.initialCharge}% → ${formData.targetCharge}% charge`,
				color: 'secondary'
			}
		];
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
			chargingTimeHours: results.chargingTimeHours,
			chargingTimeMinutes: results.chargingTimeMinutes
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
	{:else}
		<Card title="Charging Parameters">
			<div class="flex flex-col gap-4">
				{#each inputs as input (input.id)}
					<RangeInput
						label={input.label}
						value={input.getValue()}
						min={input.min}
						max={input.max}
						step={input.step}
						unit={input.unit}
						onChange={input.setValue}
						id={input.id}
						allowManualInput={true}
						allowDecimals={input.allowDecimals}
					/>
				{/each}
			</div>
		</Card>

		<Stats {stats} />

		<Tips title="Charging Recommendations" tips={chargingTips} color="info" />
	{/if}
</div>
