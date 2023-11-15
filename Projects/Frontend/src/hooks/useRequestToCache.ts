import { useState } from "react";
import { useEffectOnce } from "danholibraryrjs";

import type { Nullable, StorageOptions } from "types";
import { Request, RequestOptions } from "utils";
import useCacheEffect from "./useCacheEffect";

/**
 * Options for the useRequestToCache hook
 */
type HookOptions<TData> = {
  storageOptions: StorageOptions,

  requestOptions?: RequestOptions<any>, 
  parse?: (data: string) => TData,
};

/**
 * Makes a request to the API and stores the response in storage
 * @param endpoint Endpoint to request
 * @param options Options for the hook including storage and request options
 * @returns Nullable data from the API
 */
export default function useRequestToCache<TData>(
  endpoint: Parameters<typeof Request>['0'],
  options: HookOptions<TData>
) {
  // Destructure the options into their own variables
  const {
    storageOptions: { storage, key: STORAGE_KEY },
    requestOptions,
    parse = JSON.parse,
  } = options;

  // Store the data in state
  const [data, setData] = useState<Nullable<TData>>(null);

  // When the component mounts, check if the data is cached, if not then request it
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

  // Store the data in storage when it changes
  useCacheEffect(data, options.storageOptions, [data]);

  return data;
}