export interface RegionalRates {
  [country: string]: {
    currency: string;
    symbol: string;
    regions: {
      [region: string]: number;
    };
  };
}
