import type { StorageData } from '$lib/state/SettingsStore';

export type RegionalRates = {
  [country: string]: {
    currency: string;
    symbol: string;
    regions: {
      [region: string]: number;
    };
  };
};

export type ChargingNetwork = {
  name: string;
  pricePerKwh: number;
  membershipFee: number;
  connectionFee: number;
};

export type ChargingNetworks = {
  [country: string]: ChargingNetwork[];
};

export type Currency = {
  code: string;
  name: string;
  symbol: string;
  rate: number;
};

export type PageData = {
  calculatorData: StorageData;
  regionalRates: RegionalRates;
  chargingNetworks: ChargingNetworks;
  currencies: Currency[];
}; 