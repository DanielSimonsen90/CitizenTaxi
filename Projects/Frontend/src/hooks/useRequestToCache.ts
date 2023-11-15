import { useState } from "react";
import { useEffectOnce } from "danholibraryrjs";

import type { Nullable, StorageOptions } from "types";
import { Request } from "utils";
import useCacheEffect from "./useCacheEffect";

type HookOptions<TData> = {
  storageOptions: StorageOptions,

  requestOptions?: Parameters<typeof Request>['1'],
  parse?: (data: string) => TData,
};

export default function useRequestToCache<TData>(
  endpoint: Parameters<typeof Request>['0'],
  options: HookOptions<TData>
) {
  const {
    storageOptions: { storage, key: STORAGE_KEY },
    requestOptions,
    parse = JSON.parse,
  } = options;

  const [data, setData] = useState<Nullable<TData>>(null);

  useEffectOnce(() => {
    const cachedData = storage.getItem(STORAGE_KEY);
    if (cachedData) {
      setData(parse(cachedData));
      return;
    }

    (async function requestData() {
      const response = await Request<TData, string>(endpoint, requestOptions);
      if (!response.success) {
        return console.error(response.text);
      }

      setData(response.data);
    })();
  });

  useCacheEffect(data, options.storageOptions, [data]);

  return data;
}