import { DependencyList, useEffect } from "react";
import type { StorageOptions } from "types";

/**
 * Store a value in storage when it changes
 * @param value Value to store in storage
 * @param options Options to find storage and key
 * @param dependencies Update when these dependencies change
 */
export default function useCacheEffect<TValue>(value: TValue, options: StorageOptions, dependencies: DependencyList) {
  const { storage, key: STORAGE_KEY } = options;

  // When storage, STORAGE_KEY, value, or dependencies change, update the value in storage
  useEffect(() => {
    if (value) storage.setItem(STORAGE_KEY, JSON.stringify(value));
  }, [storage, STORAGE_KEY, value, dependencies]);
}