<script lang="ts">
	import { calculateAnnualChargingCost, calculateCO2Savings } from '$lib/utils/calculations';
	import Stats from '$lib/components/ui/Stats.svelte';

	type Result = {
		effectiveRangeKm: number;
		weeklyCharges: number;
	};

	type StatItem = {
		title: string;
		value: number | string;
		unit?: string;
		description?: string;
		color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
	};

	let { results, formData } = $props<{
		results: Result;
		formData: {
			weeklyDistanceKm: number;
			batteryKwh: number;
			usableFraction: number;
		};
	}>();

	// Default electricity cost per kWh
	const DEFAULT_COST_PER_KWH = 0.3; // €/kWh

	let annualCost = $state(0);
	let co2Savings = $state(0);
	let stats = $state<StatItem[]>([]);

	$effect(() => {
		if (results.weeklyCharges > 0) {
			annualCost = calculateAnnualChargingCost({
				weeklyCharges: results.weeklyCharges,
				batteryKwh: formData.batteryKwh,
				costPerKwh: DEFAULT_COST_PER_KWH,
				usableFraction: formData.usableFraction
			});

			co2Savings = calculateCO2Savings({
				weeklyDistanceKm: formData.weeklyDistanceKm
			});
		} else {
			annualCost = 0;
			co2Savings = 0;
		}
	});

	/**
	 * Gets the description for weekly charges based on frequency
	 */
	function getWeeklyChargesDescription(charges: number): string {
		if (charges <= 1) return 'Less than once per week';
		if (charges > 3) return 'Frequent charging needed';
		return 'Normal charging frequency';
	}

	$effect(() => {
		stats = [
			{
				title: 'Effective Range',
				value: results.effectiveRangeKm,
				unit: ' km',
				description: 'Kilometers on a full charge',
				color: 'primary'
			},
			{
				title: 'Weekly Charges',
				value: results.weeklyCharges,
				description: getWeeklyChargesDescription(results.weeklyCharges),
				color: 'secondary'
			},
			{
				title: 'CO₂ Savings',
				value: co2Savings,
				unit: ' kg',
				description: 'Compared to gasoline vehicles',
				color: 'accent'
			}
		];
	});
</script>

<Stats {stats} />
