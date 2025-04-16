import { BaseStore, type BaseStoreOptions } from './BaseStore';
import { STORAGE_KEYS } from '$lib/utils/storage';
import type { ConsentData } from '$lib/types';
import { DEFAULT_VALUES } from '$lib/utils/constants';

function validateConsentData(data: unknown): data is ConsentData {
  if (!data || typeof data !== 'object') return false;

  const d = data as Partial<ConsentData>;
  return typeof d.accepted === 'boolean' && typeof d.lastUpdated === 'string';
}

class ConsentStore extends BaseStore<ConsentData> {
  constructor() {
    const options: BaseStoreOptions<ConsentData> = {
      key: STORAGE_KEYS.CONSENT,
      initialValue: DEFAULT_VALUES.CONSENT,
      validate: validateConsentData
    };
    super(options);
  }

  updateConsent(type: keyof ConsentData, value: boolean): void {
    this.update((state) => ({
      ...state,
      [type]: value
    }));
  }

  resetToDefaults(): void {
    this.reset(DEFAULT_VALUES.CONSENT);
  }
}

export const consentStore = new ConsentStore();
