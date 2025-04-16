import type { CalculatorData, FormData, InputField, CalculatorResults, InputConfig } from '$lib/types';
import { get } from 'svelte/store';
import { calculatorStore } from '$lib/state/CalculatorStore';
import { formatValue } from '$lib/utils/formatters';

/**
 * Prepares the initial form data from calculator settings
 * @param settings Current calculator settings
 * @param inputFields Input field configurations
 * @returns Initialized form data
 */
export function prepareInitialFormData(settings: CalculatorData, inputFields: InputField[]): FormData {
  if (!inputFields || inputFields.length === 0) {
    // Return empty object if inputFields aren't ready yet
    return {};
  }

  const initialData: FormData = {};

  inputFields.forEach((field: InputField) => {
    const storeKey = field.storeKey || field.key;
    const storedValue = settings[storeKey as keyof CalculatorData];

    if (storedValue !== undefined && storedValue !== null) {
      if (field.type === 'range' || field.type === 'number') {
        const numValue = Number(storedValue);
        if (!isNaN(numValue)) {
          // Convert fraction to percentage for usable battery
          if (field.key === 'usableFraction') {
            initialData[field.key] = numValue * 100;
          } else {
            initialData[field.key] = numValue;
          }
        } else {
          initialData[field.key] = field.type === 'range' || field.type === 'number' ? 0 : '';
        }
      } else if (field.type === 'select' || field.type === 'radio') {
        initialData[field.key] = String(storedValue);
      } else {
        initialData[field.key] = storedValue;
      }
    } else {
      initialData[field.key] = field.type === 'range' || field.type === 'number' ? 0 : '';
    }
  });

  return initialData;
}

/**
 * Updates calculator store with a new value
 * @param key The store key to update
 * @param value The new value
 */
export function updateCalculatorStore(key: keyof CalculatorData, value: number | string): void {
  // Get current store value first
  const currentValue = get(calculatorStore)[key];

  // Convert percentage to fraction for usable battery before comparing
  if (key === 'usableFraction') {
    const newValue = Number(value) / 100;
    if (currentValue !== newValue) {
      calculatorStore.updateValue(key, newValue);
    }
  } else if (currentValue !== value) {
    calculatorStore.updateValue(key, value);
  }
}

/**
 * Validates form data to ensure all required values are present and valid
 * @param formData The form data to validate
 * @param inputFields Input field configurations
 * @returns True if valid, false otherwise
 */
export function isFormDataValid(formData: FormData, inputFields: InputField[]): boolean {
  if (Object.keys(formData).length === 0) return false;

  return Object.entries(formData).every(([key, value]) => {
    // Find the corresponding field definition
    const field = inputFields.find((f: InputField) => f.key === key);

    // Skip validation for select inputs and radio inputs - they're always valid once selected
    if (field?.type === 'select' || field?.type === 'radio') return true;

    // Numeric inputs should be greater than 0
    return Number(value) > 0;
  });
}

/**
 * Calculates results using the provided function
 * @param formData The current form data
 * @param calculateFn The calculation function to use
 * @returns The calculation results
 */
export function calculateFormResults(
  formData: FormData,
  calculateFn: (data: Record<string, number | string>) => CalculatorResults
): CalculatorResults {
  // Convert usableFraction to decimal for calculation
  const calculationData = { ...formData };
  if ('usableFraction' in calculationData) {
    calculationData.usableFraction = Number(calculationData.usableFraction) / 100;
  }

  // Use the provided calculation function
  return calculateFn(calculationData as Record<string, number | string>);
}

/**
 * Prepares data for tips by converting percentage values to decimals
 * @param formData The current form data
 * @param results The calculation results
 * @returns Data prepared for tips
 */
export function prepareDataForTips(formData: FormData, results: CalculatorResults): Record<string, unknown> {
  const tipData = { ...formData, ...results };

  // Convert usableFraction to decimal for tips calculation
  if ('usableFraction' in tipData) {
    tipData.usableFraction = Number(tipData.usableFraction) / 100;
  }

  return tipData;
}

/**
 * Fully initializes a calculator instance with proper error handling
 * @param inputFields Input field configurations
 * @param calculateFn The calculation function to use
 * @param getTips Function to get tips
 * @param onStateUpdate Callback to update component state
 */
export function initializeCalculator(
  inputFields: InputField[],
  calculateFn: (data: Record<string, number | string>) => CalculatorResults,
  getTips: (data: Record<string, unknown>) => string[],
  onStateUpdate: (updates: {
    formData?: FormData;
    results?: CalculatorResults;
    tips?: string[];
    isLoading?: boolean;
    error?: string | null;
    isInitialized?: boolean;
  }) => void
): void {
  if (!inputFields?.length) {
    onStateUpdate({ isLoading: false });
    return;
  }

  try {
    // Get calculator settings and prepare form data
    const settings = get(calculatorStore);
    const formData = prepareInitialFormData(settings, inputFields);

    // Mark as initialized
    onStateUpdate({ formData, isInitialized: true });

    // Calculate results if data is valid
    if (isFormDataValid(formData, inputFields)) {
      const results = calculateFormResults(formData, calculateFn);
      const tipData = prepareDataForTips(formData, results);
      const tips = getTips(tipData);

      // Update all relevant state
      onStateUpdate({ results, tips });
    }
  } catch (err) {
    console.error('Error initializing calculator:', err);
    onStateUpdate({
      error: err instanceof Error ? err.message : 'Failed to initialize calculator'
    });
  } finally {
    onStateUpdate({ isLoading: false });
  }
}

/**
 * Processes form changes, updates the store, and recalculates results
 * @param formData Current form data
 * @param inputFields Input field configurations
 * @param calculateFn Calculation function
 * @param getTips Function to get tips
 * @param onStateUpdate Callback to update component state
 */
export function processFormChange(
  formData: FormData,
  inputFields: InputField[],
  calculateFn: (data: Record<string, number | string>) => CalculatorResults,
  getTips: (data: Record<string, unknown>) => string[],
  onStateUpdate: (updates: { results?: CalculatorResults; tips?: string[]; error?: string | null }) => void
): void {
  if (!isFormDataValid(formData, inputFields)) {
    return;
  }

  try {
    // Clear any existing errors
    onStateUpdate({ error: null });

    // Calculate results
    const results = calculateFormResults(formData, calculateFn);

    // Prepare data for tips
    const tipData = prepareDataForTips(formData, results);
    const tips = getTips(tipData);

    // Update state
    onStateUpdate({ results, tips });
  } catch (err) {
    console.error('Calculation error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to calculate results';
    const errorTips = resetCalculatorResults(() => ['Check your input values and try again']);

    onStateUpdate({
      error: errorMessage,
      results: {},
      tips: errorTips
    });
  }
}

/**
 * Creates input configurations for the parameter form
 * @param inputFields The input field configurations
 * @param formData The current form data
 * @param onSaveAndCalculate Function to call when a value changes
 * @returns Input configurations for the parameter form
 */
export function generateInputConfigurations(
  inputFields: InputField[],
  formData: FormData,
  onSaveAndCalculate: () => void
): InputConfig[] {
  return inputFields.map((field: InputField) => {
    // Check if this is a select input
    if (field.type === 'select' && field.options) {
      return {
        id: field.key,
        label: field.label,
        options: field.options,
        type: 'select' as const,
        getValue: () => (formData[field.key] as string) || '',
        setValue: (val: string) => {
          if (formData[field.key] === val) return;
          formData[field.key] = val;
          const storeKey = field.storeKey || field.key;
          updateCalculatorStore(storeKey as keyof CalculatorData, val);
          onSaveAndCalculate();
        }
      };
    }

    // Check if this is a radio input
    if (field.type === 'radio' && field.options) {
      return {
        id: field.key,
        label: field.label,
        options: field.options,
        type: 'radio' as const,
        getValue: () => (formData[field.key] as string) || '',
        setValue: (val: string) => {
          if (formData[field.key] === val) return;
          formData[field.key] = val;
          const storeKey = field.storeKey || field.key;
          updateCalculatorStore(storeKey as keyof CalculatorData, val);
          onSaveAndCalculate();
        }
      };
    }

    // Default to range input
    return {
      id: field.key,
      label: field.label,
      min: field.min || 0,
      max: field.max || 100,
      step: field.step || 1,
      unit: field.unit || '',
      allowDecimals: field.allowDecimals || false,
      type: 'range' as const,
      getValue: () => (formData[field.key] as number) || 0,
      setValue: (val: number) => {
        const formattedValue = field.allowDecimals ? val : formatValue(val);

        if (formData[field.key] === formattedValue) return;
        formData[field.key] = formattedValue;

        const storeKey = field.storeKey || field.key;
        updateCalculatorStore(storeKey as keyof CalculatorData, formattedValue);
        onSaveAndCalculate();
      }
    };
  });
}

/**
 * Refreshes calculator data from the store
 * @param onSuccess Callback called on successful refresh with new formData
 * @param onError Callback called on error with error message
 */
export function refreshCalculatorData(
  inputFields: InputField[],
  onSuccess: (formData: FormData) => void,
  onError: (error: string) => void
): void {
  try {
    if (!inputFields || inputFields.length === 0) {
      // Skip processing if inputFields aren't ready
      return;
    }

    const settings = get(calculatorStore);
    const formData = prepareInitialFormData(settings, inputFields);

    onSuccess(formData);
  } catch (err) {
    console.error('Error refreshing calculator data:', err);
    onError(err instanceof Error ? err.message : 'Failed to refresh calculator data');
  }
}

/**
 * Resets calculator results
 * @param getErrorTips Function to get error tips
 * @returns Default error tips
 */
export function resetCalculatorResults(
  getErrorTips: () => string[] = () => ['Check your input values and try again']
): string[] {
  return getErrorTips();
}
