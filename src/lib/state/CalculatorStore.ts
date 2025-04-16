import { BaseStore, type BaseStoreOptions } from './BaseStore';
import { STORAGE_KEYS } from '$lib/utils/storage';
import type { CalculatorData } from '$lib/types/calculator';
import { DEFAULT_CALCULATOR, DEFAULT_VALUES } from '$lib/utils/constants';
function validateCalculatorData(data: unknown): data is CalculatorData {
  if (!data || typeof data !== 'object') return false;

  const d = data as Partial<CalculatorData>;

  return (
    typeof d.batteryCapacity === 'number' &&
    typeof d.chargingEfficiency === 'number' &&
    typeof d.electricityRate === 'number' &&
    typeof d.currency === 'string' &&
    typeof d.weeklyDistanceKm === 'number' &&
    typeof d.batteryKwh === 'number' &&
    typeof d.consumptionKwhPer100km === 'number' &&
    typeof d.usableFraction === 'number' &&
    typeof d.initialCharge === 'number' &&
    typeof d.targetCharge === 'number' &&
    typeof d.chargingPower === 'number' &&
    typeof d.temperatureC === 'number' &&
    typeof d.phases === 'number' &&
    typeof d.peakElectricityRate === 'number' &&
    typeof d.offPeakElectricityRate === 'number' &&
    typeof d.chargingDuringOffPeak === 'number' &&
    (d.chargingType === 'AC' || d.chargingType === 'DC')
  );
}

class CalculatorStore extends BaseStore<CalculatorData> {
  constructor() {
    const options: BaseStoreOptions<CalculatorData> = {
      key: STORAGE_KEYS.CALCULATOR,
      initialValue: DEFAULT_VALUES.CALCULATOR,
      validate: validateCalculatorData
    };
    super(options);
  }

  updateValue<K extends keyof CalculatorData>(key: K, value: CalculatorData[K]): void {
    this.update((state) => ({ ...state, [key]: value }));
  }

  resetToDefaults(): void {
    this.reset(DEFAULT_VALUES.CALCULATOR);
  }
}

export const calculatorStore = new CalculatorStore();
