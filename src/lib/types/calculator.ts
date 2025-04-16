export interface CalculatorData {
  batteryCapacity: number;
  chargingEfficiency: number;
  electricityRate: number;
  currency: string;
  weeklyDistanceKm: number;
  batteryKwh: number;
  consumptionKwhPer100km: number;
  usableFraction: number;
  initialCharge: number;
  targetCharge: number;
  chargingPower: number;
  temperatureC: number;
  phases: number;
  peakElectricityRate: number;
  offPeakElectricityRate: number;
  chargingDuringOffPeak: number;
  chargingType: 'AC' | 'DC';
}

export interface CalculatorResults {
  [key: string]: {
    value: number;
    label: string;
    unit?: string;
  };
}

export interface InputField {
  key: string;
  storeKey?: string;
  label: string;
  type: 'number' | 'select' | 'radio' | 'range';
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: string; label: string }>;
  description?: string;
  placeholder?: string;
  allowDecimals?: boolean;
}

export interface FormData {
  [key: string]: number | string;
}

export interface FormInput {
  id: string;
  label: string;
  key: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  allowDecimals?: boolean;
  storeKey?: string;
  options?: Array<{ value: string; label: string }>;
  type?: 'select' | 'range' | 'radio';
}

export interface CalculatorProps {
  title?: string;
  inputFields: InputField[];
  calculateFn: (formData: Record<string, number>) => CalculatorResults;
  statsComponent: any;
  getTips?: (data: Record<string, any>) => string[];
  getErrorTips?: () => string[];
  children?: () => unknown;
  currency?: string;
}
