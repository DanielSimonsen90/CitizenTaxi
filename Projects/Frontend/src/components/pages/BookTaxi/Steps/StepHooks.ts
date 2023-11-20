import { useSearchParams } from "react-router-dom";

export function useDefaultStepValue(key: string): string | undefined {
  const [params] = useSearchParams();
  const defaultValue = params.has('booking') 
    ? (JSON.parse(params.get('booking')!))[key] 
    : undefined;

  return defaultValue;
}