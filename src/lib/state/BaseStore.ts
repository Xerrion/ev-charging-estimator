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
  protected initialValue: T;
  private lastValue: T;

  constructor(options: BaseStoreOptions<T>) {
    this.key = options.key;
    this.validate = options.validate;
    this.initialValue = options.initialValue;
    this.lastValue = this.initialValue;
    this.store = writable(this.initialValue);
    console.log(`[${this.key}] Constructor - Initial Value:`, this.initialValue);

    if (browser && !BaseStore.initialized.has(this.key)) {
      this.initializeFromStorage();
      BaseStore.initialized.add(this.key);
    }
  }

  private initializeFromStorage(): void {
    try {
      const storedValue = getValue(this.key);
      console.log(`[${this.key}] Loading from storage:`, storedValue);

      if (storedValue !== null) {
        if (this.validate && !this.validate(storedValue)) {
          console.warn(`[${this.key}] Invalid stored value. Using initial value:`, this.initialValue);
          this.store.set(this.initialValue);
          return;
        }
        console.log(`[${this.key}] Setting stored value:`, storedValue);
        this.store.set(storedValue as T);
        this.lastValue = storedValue as T;
      } else {
        console.log(`[${this.key}] No stored value. Setting initial:`, this.initialValue);
        this.store.set(this.initialValue);
        setValue(this.key, this.initialValue);
      }
    } catch (error) {
      console.error(`[${this.key}] Error loading from storage:`, error);
      this.store.set(this.initialValue);
    }
  }

  private hasValueChanged(newValue: T, oldValue: T): boolean {
    if (typeof newValue !== typeof oldValue) return true;
    if (newValue === oldValue) return false;
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  }

  subscribe(run: (value: T) => void): () => void {
    return this.store.subscribe((value) => {
      if (this.hasValueChanged(value, this.lastValue)) {
        console.log(`[${this.key}] Value changed:`, value);
        this.lastValue = value;
      }
      run(value);
    });
  }

  set(value: T): void {
    if (this.hasValueChanged(value, this.lastValue)) {
      console.log(`[${this.key}] Setting new value:`, value);
      this.store.set(value);
      this.lastValue = value;
      if (browser) {
        try {
          setValue(this.key, value);
        } catch (error) {
          console.error(`[${this.key}] Error saving to storage:`, error);
        }
      }
    }
  }

  update(updater: (value: T) => T): void {
    this.store.update((current) => {
      const updated = updater(current);
      if (this.hasValueChanged(updated, current)) {
        if (browser) {
          try {
            setValue(this.key, updated);
          } catch (error) {
            console.error(`[${this.key}] Error saving to storage:`, error);
          }
        }
        this.lastValue = updated;
      }
      return updated;
    });
  }

  reset(value: T): void {
    if (this.hasValueChanged(value, this.lastValue)) {
      console.log(`[${this.key}] Resetting to:`, value);
      this.set(value);
    }
  }
}
