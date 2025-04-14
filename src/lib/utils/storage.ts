import { DEFAULT_VALUES } from './constants';

const STORAGE_KEY = 'ev-calculator-data';

type StorageData = {
	weeklyDistanceKm: number;
	batteryKwh: number;
	consumptionKwhPer100km: number;
	usableFraction: number;
	initialCharge: number;
	targetCharge: number;
	chargingPower: number;
	chargingEfficiency: number;
	theme: 'light' | 'dark';
};

export const defaultValues: StorageData = {
	...DEFAULT_VALUES,
	initialCharge: 20,
	targetCharge: 80,
	chargingPower: 11,
	chargingEfficiency: 90
};

export function saveData(data: Partial<StorageData>): void {
	if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

	try {
		const existingData = getData();
		const newData = { ...existingData, ...data };

		// Ensure we have valid numbers before saving
		Object.entries(newData).forEach(([key, value]) => {
			if (typeof value === 'number' && isNaN(value)) {
				// Replace NaN with default value
				(newData as any)[key] = (defaultValues as any)[key];
			}
		});

		localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
		console.log('Data saved:', newData);
	} catch (error) {
		console.error('Failed to save data to localStorage:', error);
	}
}

export function getData(): StorageData {
	if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
		return defaultValues;
	}

	try {
		const data = localStorage.getItem(STORAGE_KEY);
		if (!data) return defaultValues;

		const parsedData = JSON.parse(data) as Partial<StorageData>;

		// Ensure all required fields exist with proper types
		const result: StorageData = {
			weeklyDistanceKm:
				typeof parsedData.weeklyDistanceKm === 'number' && !isNaN(parsedData.weeklyDistanceKm)
					? parsedData.weeklyDistanceKm
					: defaultValues.weeklyDistanceKm,

			batteryKwh:
				typeof parsedData.batteryKwh === 'number' && !isNaN(parsedData.batteryKwh)
					? parsedData.batteryKwh
					: defaultValues.batteryKwh,

			consumptionKwhPer100km:
				typeof parsedData.consumptionKwhPer100km === 'number' &&
				!isNaN(parsedData.consumptionKwhPer100km)
					? parsedData.consumptionKwhPer100km
					: defaultValues.consumptionKwhPer100km,

			usableFraction:
				typeof parsedData.usableFraction === 'number' && !isNaN(parsedData.usableFraction)
					? parsedData.usableFraction
					: defaultValues.usableFraction,

			initialCharge:
				typeof parsedData.initialCharge === 'number' && !isNaN(parsedData.initialCharge)
					? parsedData.initialCharge
					: defaultValues.initialCharge,

			targetCharge:
				typeof parsedData.targetCharge === 'number' && !isNaN(parsedData.targetCharge)
					? parsedData.targetCharge
					: defaultValues.targetCharge,

			chargingPower:
				typeof parsedData.chargingPower === 'number' && !isNaN(parsedData.chargingPower)
					? parsedData.chargingPower
					: defaultValues.chargingPower,

			chargingEfficiency:
				typeof parsedData.chargingEfficiency === 'number' && !isNaN(parsedData.chargingEfficiency)
					? parsedData.chargingEfficiency
					: defaultValues.chargingEfficiency,

			theme:
				parsedData.theme === 'dark' || parsedData.theme === 'light'
					? parsedData.theme
					: defaultValues.theme
		};

		console.log('Data loaded:', result);
		return result;
	} catch (error) {
		console.error('Failed to retrieve data from localStorage:', error);
		return defaultValues;
	}
}
