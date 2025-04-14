/**
 * Constants for the EV Charge Frequency Estimator
 */

export const INPUT_RANGES = {
	// Weekly distance in kilometers
	WEEKLY_DISTANCE: {
		MIN: 50,
		MAX: 2000,
		STEP: 10
	},

	// Battery capacity in kilowatt-hours
	BATTERY_CAPACITY: {
		MIN: 20,
		MAX: 150,
		STEP: 1
	},

	// Energy consumption in kilowatt-hours per 100 kilometers
	ENERGY_CONSUMPTION: {
		MIN: 10,
		MAX: 30,
		STEP: 0.1
	},

	// Usable battery percentage
	USABLE_BATTERY: {
		MIN: 60,
		MAX: 100,
		STEP: 1
	}
};

// Default values for the calculator
export const DEFAULT_VALUES = {
	weeklyDistanceKm: 250,
	batteryKwh: 60,
	consumptionKwhPer100km: 16,
	usableFraction: 0.9,
	theme: 'light' as 'light' | 'dark'
};
