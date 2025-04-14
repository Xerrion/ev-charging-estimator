/**
 * Utility functions for EV charging calculations
 */

/**
 * Calculates the effective range of an EV in kilometers
 */
export function calculateEffectiveRange({
	batteryKwh,
	consumptionKwhPer100km,
	usableFraction = 0.9
}: {
	batteryKwh: number;
	consumptionKwhPer100km: number;
	usableFraction?: number;
}): number {
	// Calculate how far the vehicle can go on a single charge
	const effectiveRangeKm = ((batteryKwh * usableFraction) / consumptionKwhPer100km) * 100;
	return Number(effectiveRangeKm.toFixed(2));
}

/**
 * Calculates weekly charges needed based on driving distance and vehicle range
 */
export function calculateWeeklyCharges({
	weeklyDistanceKm,
	effectiveRangeKm
}: {
	weeklyDistanceKm: number;
	effectiveRangeKm: number;
}): number {
	if (effectiveRangeKm <= 0) return 0;
	return Math.ceil(weeklyDistanceKm / effectiveRangeKm);
}

/**
 * Estimates the number of EV charges required per week based on driving habits and vehicle specifications
 */
export function weeklyEvChargeEstimator({
	weeklyDistanceKm,
	batteryKwh,
	consumptionKwhPer100km,
	usableFraction = 0.9
}: {
	weeklyDistanceKm: number;
	batteryKwh: number;
	consumptionKwhPer100km: number;
	usableFraction?: number;
}) {
	const effectiveRangeKm = calculateEffectiveRange({
		batteryKwh,
		consumptionKwhPer100km,
		usableFraction
	});

	const weeklyCharges = calculateWeeklyCharges({
		weeklyDistanceKm,
		effectiveRangeKm
	});

	return {
		effectiveRangeKm,
		weeklyCharges
	};
}

/**
 * Calculates the estimated annual charging costs
 */
export function calculateAnnualChargingCost({
	weeklyCharges,
	batteryKwh,
	costPerKwh,
	usableFraction = 0.9
}: {
	weeklyCharges: number;
	batteryKwh: number;
	costPerKwh: number;
	usableFraction?: number;
}): number {
	const energyPerCharge = batteryKwh * usableFraction;
	const weeklyCost = weeklyCharges * energyPerCharge * costPerKwh;
	const annualCost = weeklyCost * 52;

	return Number(annualCost.toFixed(2));
}

/**
 * Calculates the CO2 emissions saved compared to a gasoline vehicle
 */
export function calculateCO2Savings({
	weeklyDistanceKm,
	gasolineEmissionsGramPerKm = 120,
	electricityEmissionsGramPerKm = 30
}: {
	weeklyDistanceKm: number;
	gasolineEmissionsGramPerKm?: number;
	electricityEmissionsGramPerKm?: number;
}): number {
	const annualDistanceKm = weeklyDistanceKm * 52;
	const gasolineEmissionsKg = (annualDistanceKm * gasolineEmissionsGramPerKm) / 1000;
	const electricityEmissionsKg = (annualDistanceKm * electricityEmissionsGramPerKm) / 1000;
	const savingsKg = gasolineEmissionsKg - electricityEmissionsKg;

	return Number(savingsKg.toFixed(2));
}
