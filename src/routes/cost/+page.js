import { browser } from '$app/environment';
import { DEFAULT_VALUES } from '$lib/utils/constants';

// Regional electricity prices (average residential rates)
const REGIONAL_ELECTRICITY_RATES = {
  'United States': {
    currency: 'USD',
    symbol: '$',
    regions: {
      'National Average': 0.15,
      'California': 0.26,
      'Texas': 0.13,
      'New York': 0.22,
      'Florida': 0.14,
      'Washington': 0.11
    }
  },
  'Europe': {
    currency: 'EUR',
    symbol: '€',
    regions: {
      'EU Average': 0.25,
      'Germany': 0.37,
      'France': 0.21,
      'Spain': 0.29,
      'Italy': 0.31,
      'United Kingdom': 0.27
    }
  },
  'Canada': {
    currency: 'CAD',
    symbol: 'C$',
    regions: {
      'National Average': 0.14,
      'Ontario': 0.16,
      'Quebec': 0.08,
      'British Columbia': 0.14,
      'Alberta': 0.17
    }
  }
};

// Charging network companies and their pricing
const CHARGING_NETWORKS = {
  'United States': [
    { name: 'Home Charging', pricePerKwh: 0.15, membershipFee: 0, connectionFee: 0 },
    { name: 'Tesla Supercharger', pricePerKwh: 0.28, membershipFee: 0, connectionFee: 0 },
    { name: 'ChargePoint', pricePerKwh: 0.31, membershipFee: 0, connectionFee: 1.50 },
    { name: 'EVgo', pricePerKwh: 0.35, membershipFee: 7.99, connectionFee: 2.99 },
    { name: 'Electrify America', pricePerKwh: 0.43, membershipFee: 4.00, connectionFee: 0 }
  ],
  'Europe': [
    { name: 'Home Charging', pricePerKwh: 0.25, membershipFee: 0, connectionFee: 0 },
    { name: 'Tesla Supercharger', pricePerKwh: 0.33, membershipFee: 0, connectionFee: 0 },
    { name: 'IONITY', pricePerKwh: 0.79, membershipFee: 0, connectionFee: 0 },
    { name: 'Fastned', pricePerKwh: 0.59, membershipFee: 11.99, connectionFee: 0 }
  ],
  'Canada': [
    { name: 'Home Charging', pricePerKwh: 0.14, membershipFee: 0, connectionFee: 0 },
    { name: 'Tesla Supercharger', pricePerKwh: 0.26, membershipFee: 0, connectionFee: 0 },
    { name: 'ChargePoint', pricePerKwh: 0.27, membershipFee: 0, connectionFee: 1.50 },
    { name: 'Flo', pricePerKwh: 0.25, membershipFee: 0, connectionFee: 1.00 }
  ]
};

// Currency options with conversion rates (based on USD)
const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.78 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.51 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.35 }
];

export function load() {
  // Initialize with default values
  let calculatorData = { ...DEFAULT_VALUES };
  
  // Only access localStorage in the browser
  if (browser) {
    try {
      const storedData = localStorage.getItem('ev-calculator-data');
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Use stored data if valid, otherwise fallback to defaults
        if (parsedData && typeof parsedData === 'object') {
          calculatorData = {
            ...calculatorData, // Keep defaults as fallback
            ...parsedData // Override with stored values
          };
        }
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
  }

  return {
    calculatorData,
    regionalRates: REGIONAL_ELECTRICITY_RATES,
    chargingNetworks: CHARGING_NETWORKS,
    currencies: CURRENCIES
  };
} 