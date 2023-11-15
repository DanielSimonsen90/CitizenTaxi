import { DependencyList, useEffect } from "react";
import type { StorageOptions } from "types";

export default function useCacheEffect<TValue>(value: TValue, options: StorageOptions, dependencies: DependencyList) {
  const { storage, key: STORAGE_KEY } = options;

  useEffect(() => {
    if (value) storage.setItem(STORAGE_KEY, JSON.stringify(value));
  }, [storage, STORAGE_KEY, value, dependencies]);
}