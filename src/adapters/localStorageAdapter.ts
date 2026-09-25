import { StoragePort } from '../domain/ports/StoragePort';

export class LocalStorageAdapter implements StoragePort {
  private getStorage(): Storage | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage;
      }
      if (typeof localStorage !== 'undefined') {
        return localStorage;
      }
    } catch {
      return null;
    }
    return null;
  }

  getItem<T>(key: string): T | null {
    try {
      const storage = this.getStorage();
      if (!storage) return null;
      const raw = storage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (error) {
      console.warn(`[LocalStorageAdapter] Error getting key "${key}":`, error);
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      const storage = this.getStorage();
      if (!storage) return;
      storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`[LocalStorageAdapter] Error setting key "${key}":`, error);
    }
  }

  removeItem(key: string): void {
    try {
      const storage = this.getStorage();
      if (!storage) return;
      storage.removeItem(key);
    } catch (error) {
      console.warn(`[LocalStorageAdapter] Error removing key "${key}":`, error);
    }
  }

  clear(): void {
    try {
      const storage = this.getStorage();
      if (!storage) return;
      storage.clear();
    } catch (error) {
      console.warn('[LocalStorageAdapter] Error clearing storage:', error);
    }
  }
}

export const localStorageAdapter = new LocalStorageAdapter();
