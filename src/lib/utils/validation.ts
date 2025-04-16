import type { Settings } from '$lib/types';

const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  consent: {
    accepted: false,
    lastUpdated: new Date().toISOString()
  }
};

export function validateStoredData(data: unknown): Settings {
  if (!data || typeof data !== 'object') {
    return { ...DEFAULT_SETTINGS };
  }

  const settings = data as Partial<Settings>;

  return {
    theme: isValidTheme(settings.theme) ? settings.theme : DEFAULT_SETTINGS.theme,
    consent: isValidConsent(settings.consent) ? settings.consent : DEFAULT_SETTINGS.consent
  };
}

function isValidTheme(theme: unknown): theme is Settings['theme'] {
  return theme === 'light' || theme === 'dark' || theme === 'system';
}

function isValidConsent(consent: unknown): consent is Settings['consent'] {
  return typeof consent === 'object' && consent !== null && 'accepted' in consent && 'lastUpdated' in consent;
}

export { DEFAULT_SETTINGS };
