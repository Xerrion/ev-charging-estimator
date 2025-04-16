import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import { getValue, setValue, type StorageValue } from '$lib/utils/storage';

export interface BaseStoreOptions<T extends StorageValue> {
  key: string;
  initialValue: T;
  validate?: (value: unknown) => value is T;
}

export class BaseStore<T extends StorageValue> {
  private static initialized = new Set<string>();
  protected store: Writable<T>;
  protected key: string;
  protected validate?: (value: unknown) => value is T;

  constructor(options: BaseStoreOptions<T>) {
    this.key = options.key;
    this.validate = options.validate;
    this.store = writable(options.initialValue);

    if (browser && !BaseStore.initialized.has(this.key)) {
      this.initializeFromStorage();
      BaseStore.initialized.add(this.key);
    }
  }

  private initializeFromStorage(): void {
    try {
      const storedValue = getValue(this.key);

      if (storedValue !== null) {
        if (this.validate && !this.validate(storedValue)) {
          console.warn(`Invalid stored value for key "${this.key}". Using initial value.`);
          return;
        }
        this.store.set(storedValue as T);
      }
    } catch (error) {
      console.error(`Error loading from storage for key "${this.key}":`, error);
    }
  }

  subscribe(run: (value: T) => void): () => void {
    return this.store.subscribe(run);
  }

  set(value: T): void {
    this.store.set(value);
    if (browser) {
      try {
        setValue(this.key, value);
      } catch (error) {
        console.error(`Error saving to storage for key "${this.key}":`, error);
      }
    }
  }

  update(updater: (value: T) => T): void {
    this.store.update((current) => {
      const updated = updater(current);
      if (browser) {
        try {
          setValue(this.key, updated);
        } catch (error) {
          console.error(`Error saving to storage for key "${this.key}":`, error);
        }
      }
      return updated;
    });
  }

  reset(value: T): void {
    this.set(value);
  }
}
