/**
 * Types for input components
 */

// Common option type for select and radio inputs
export type InputOption = {
  value: string;
  label: string;
};

// Base input configuration with common accessibility properties
export interface BaseInputConfig {
  id: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  ariaDescribedBy?: string;
  errorMessage?: string;
}

// Range input configuration
export interface RangeInputConfig extends BaseInputConfig {
  min: number;
  max: number;
  step: number;
  unit: string;
  allowDecimals: boolean;
  getValue: () => number;
  setValue: (val: number) => void;
  type?: 'range';
}

// Select input configuration
export interface SelectInputConfig extends BaseInputConfig {
  options: InputOption[];
  getValue: () => string;
  setValue: (val: string) => void;
  type: 'select';
}

// Radio input configuration
export interface RadioInputConfig extends BaseInputConfig {
  options: InputOption[];
  getValue: () => string;
  setValue: (val: string) => void;
  type: 'radio';
}

// Checkbox input configuration
export interface CheckboxInputConfig extends BaseInputConfig {
  getValue: () => boolean;
  setValue: (val: boolean) => void;
  type: 'checkbox';
}

// Text input configuration
export interface TextInputConfig extends BaseInputConfig {
  placeholder?: string;
  pattern?: string;
  minlength?: number;
  maxlength?: number;
  autocomplete?: string;
  getValue: () => string;
  setValue: (val: string) => void;
  type: 'text';
}

// Number input configuration
export interface NumberInputConfig extends BaseInputConfig {
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  getValue: () => number;
  setValue: (val: number) => void;
  type: 'number';
}

// Union type for all input configurations
export type InputConfig = 
  | RangeInputConfig 
  | SelectInputConfig 
  | RadioInputConfig 
  | CheckboxInputConfig
  | TextInputConfig
  | NumberInputConfig;