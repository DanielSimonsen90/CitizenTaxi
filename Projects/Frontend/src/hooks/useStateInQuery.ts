import { useEffectOnce } from "danholibraryrjs";
import { useState, SetStateAction } from "react";
import { useSearchParams } from "react-router-dom";

export default function useStateInQuery<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [params, setParams] = useSearchParams();

  const setQuery = (newValue: SetStateAction<T>) => {
    const compuiledValue = typeof newValue === 'function'
      ? (newValue as Function)(value)
      : newValue;

    setParams(params => {
      params.set(key, JSON.stringify(compuiledValue));
      return params;
    });
    setValue(compuiledValue);
  };

  useEffectOnce(() => {
    const value = params.get(key);
    if (!value) return;
    try {
      setValue(JSON.parse(value));
    } catch (error) {
      setValue(defaultValue);
    }
  });

  return [value, setQuery] as const;
}