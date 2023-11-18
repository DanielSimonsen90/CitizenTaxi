import { Guid } from "types";

// Define API_ENDPOINT_SECURE by environment, if development then use localhost, else use azurewebsites
if (process.env.NODE_ENV === 'development') {
  var API_ENDPOINT_SECURE = "https://localhost:5000/api";
} else {
  API_ENDPOINT_SECURE = "https://citizentaxi.azurewebsites.net/api";
}
export { API_ENDPOINT_SECURE };

// Export path for SignalR
export const API_ENDPOINT_SECURE_SIGNALR = API_ENDPOINT_SECURE + "/notificationhub";

// An ApiEndpoint paramter can be either a string or undefined
type TParam = string | undefined;

// All possible endpoints for the API. This will generate autocomplete when using the Request function
export type ApiEndpoints<Param extends TParam = undefined> =
  | `bookings` // [GET, POST]
  | `bookings?citizenId=${Param}` // [GET] Guid
  | `bookings/${Param}` // [GET, PUT, DELETE] Guid bookingId

  | `notes` // [GET, POST]
  | `notes?citizenId=${Param}` // [GET] Guid
  | `notes/${Param}` // [GET, PUT, DELETE] Guid noteId

  | `users` // [GET, POST]
  | `users?role=${Param}` // [GET] enum Role
  | `users/${Param}` // [GET, PUT, DELETE] Guid userId
  | `users/authenticate`; // [POST, DELETE]

// All possible HTTP methods
export type HttpMethods =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE';

// Options for the Request function
export type RequestOptions<TBody = any> = Omit<RequestInit, 'method' | 'body'> & {
  method?: HttpMethods;
  body?: TBody;
  noHeaders?: boolean;
  controller?: AbortController;
  query?: Record<string, string | undefined>;
};

/**
 * Makes a request to the API
 * @param path Api endpoint to request
 * @param options Additional options for the request
 * @returns The response from the API
 */
export async function Request<TData, Param extends TParam = undefined>(
  path: ApiEndpoints<Param>,
  // Destructor the options object, if it's undefined then set it to an empty object
  {
    method = 'GET',
    body,
    noHeaders = false,
    controller = new AbortController(),
    query,
  }: RequestOptions | undefined = {}) {
  // console.log(`Requesting ${path} with method ${method}`);

  // Construct the endpoint for the request
  const endpoint = (() => {
    const result = API_ENDPOINT_SECURE + ensureSlash(path);
    if (path.includes('?') || !query) return result;

    // If the query object is defined, then construct a query string from it
    const queryString = Object.entries(query)
      .map(([key, value]) => value ? `${key}=${value}` : '')
      .join('&');

    return path.includes('?') ? `${result}&${queryString}` : `${result}?${queryString}`;
  })();

  // Construct the request init object to pass to the fetch function
  const init: RequestInit = {
    method,
    body: body ? !noHeaders ? JSON.stringify(body) : body : undefined,
    headers: !noHeaders ? { 'Content-Type': 'application/json' } : undefined,
    signal: controller.signal,
    credentials: 'include'
  };

  // Make the request, log any errors, and throw them again
  const res = await fetch(endpoint, init).catch(err => {
    console.error(`Failed to [${method}] ${path}`, err);
    throw err;
  });

  // console.log(`[${method}] ${path} responded with ${res.status}`, res);

  // Clone the response so that it can be converted to JSON and text
  const clone = res.clone();

  // All successful responses are in the 200s, so check if the status code starts with 2
  const isSuccessful = res.status.toString().startsWith('2');

  // This try-catch block is used to catch any errors when converting the response to JSON
  // If the response is not jsonable, then the catch will return null for the data
  try {
    return {
      success: isSuccessful,
      status: res.status,
      data: await res.json() as TData,
      text: await clone.text(),
    };
  } catch {
    return {
      success: isSuccessful,
      status: res.status,
      data: null as unknown as TData,
      text: await clone.text(),
    };
  }
}

/**
 * Ensures that the path starts with a /
 * @param path Path string
 * @returns Path that starts with a /
 */
export function ensureSlash(path: string) {
  return path.startsWith('/') ? path : '/' + path;
}

/**
 * Makes a request to the API and returns the data
 * @param endpoint Api endpoint to request
 * @param citizenId Citizen id to use in the query string
 * @returns The data from the API
 */
export async function RequestEntity<TData>(endpoint: ApiEndpoints<any>, citizenId?: Guid) {
  const response = await Request<TData, Guid>(endpoint, { query: { citizenId } });
  if (response.success) return response.data;

  console.error(response.text);
  return null;
}