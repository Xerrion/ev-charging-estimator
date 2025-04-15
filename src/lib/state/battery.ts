import { derived, get } from 'svelte/store';
import { settingsStore } from './SettingsStore';

/**
 * @deprecated Use evSettings.batteryCapacity instead
 * This is kept for backwards compatibility.
 */
export const batteryCapacityStore = derived(settingsStore, ($settings) => $settings.batteryKwh);

/**
 * @deprecated Use evSettings.update({batteryKwh: value}) instead
 * This is kept for backwards compatibility.
 */
export function updateBatteryCapacity(value: number): void {
  settingsStore.update({ batteryKwh: value });
}

/**
 * @deprecated Use get(evSettings).batteryKwh instead
 * This is kept for backwards compatibility.
 */
export function getBatteryCapacity(): number {
  return get(settingsStore).batteryKwh;
}
