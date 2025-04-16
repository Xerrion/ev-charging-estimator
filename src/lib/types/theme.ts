export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
  current: Theme;
  system: 'light' | 'dark';
}
