import { useUpdateEffect } from "danholibraryrjs";
import { DependencyList } from "react";

export default function useUpdateAsyncEffect(effect: () => Promise<void>, dependencies: DependencyList = []) {
  useUpdateEffect(() => {
    effect();
  }, dependencies);
};