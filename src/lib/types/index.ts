export interface ConsentData {
  accepted: boolean;
  lastUpdated: string;
}

export interface ThemeState {
  current: 'light' | 'dark' | 'system';
  system: 'light' | 'dark';
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  consent: {
    accepted: boolean;
    lastUpdated: string;
  };
}

export * from './calculator';
export * from './theme';
export * from './consent';
export * from './input';
