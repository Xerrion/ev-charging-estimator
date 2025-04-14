import { getData, saveData } from '$lib/utils/storage';
import { writable } from 'svelte/store';

// Create a writable store with the initial battery capacity
const batteryCapacityStore = writable(getData().batteryKwh);

// Update function that also saves to storage
function updateBatteryCapacity(value: number) {
	batteryCapacityStore.set(value);
	saveData({ batteryKwh: value });
}

// Export a getter to ensure the latest value is always retrieved
function getBatteryCapacity() {
	let currentValue: number;
	batteryCapacityStore.subscribe((value) => {
		currentValue = value;
	})();
	return currentValue!;
}

// Export the store directly for subscription in components
export { batteryCapacityStore, getBatteryCapacity, updateBatteryCapacity };
