if (process.env.NODE_ENV === 'development') {
  var API_ENDPOINT_SECURE = "https://localhost:5000/api";
} else {
  API_ENDPOINT_SECURE = "https://citizentaxi.azurewebsites.net/api";
}
export { API_ENDPOINT_SECURE };

export const API_ENDPOINT_SECURE_SIGNALR = API_ENDPOINT_SECURE + "/notificationhub";

type TParam = string | undefined;

type ApiEndpoints<Param extends TParam = undefined> =
  | `bookings` // [GET, POST]
  | `bookings?citizenId=${Param}` // [GET] Guid
  | `bookings/${Param}` // [GET, PUT, DELETE] Guid bookingId

  | `notes` // [GET, POST]
  | `notes?citizenId=${Param}` // [GET] Guid
  | `notes/${Param}` // [GET, PUT, DELETE] Guid noteId

  | `users` // [GET, POST]
  | `users?role=${Param}` // [GET] enum Role
  | `users/${Param}` // [GET, PUT, DELETE] Guid userId
  | `users/authenticate` // [POST, DELETE]

export type HttpMethods =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE';

type RequestOptions<TBody = any> = Omit<RequestInit, 'method' | 'body'> & {
  method?: HttpMethods;
  body?: TBody;
  noHeaders?: boolean;
  controller?: AbortController;
  query?: Record<string, string>;
};

export async function Request<TData, Param extends TParam = undefined>(
  path: ApiEndpoints<Param>,
  {
    method = 'GET',
    body,
    noHeaders = false,
    controller = new AbortController(),
    query,
  }: RequestOptions | undefined = {}) {
  // console.log(`Requesting ${path} with method ${method}`);

  const endpoint = (() => {
    const result = API_ENDPOINT_SECURE + ensureSlash(path);
    if (path.includes('?') || !query) return result;

    const queryString = Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    return path.includes('?') ? `${result}&${queryString}` : `${result}?${queryString}`;
  })();

  const init: RequestInit = {
    method,
    body: body ? !noHeaders ? JSON.stringify(body) : body : undefined,
    headers: !noHeaders ? { 'Content-Type': 'application/json' } : undefined,
    signal: controller.signal,
  };

  const res = await fetch(endpoint, init).catch(err => {
    if (err instanceof Error && err.message.includes('Failed to fetch')) {
      return fetch(API_ENDPOINT_SECURE + ensureSlash(path), init);
    }

    console.error(`Failed to [${method}] ${path}`, err);
    throw err;
  });

  const clone = res.clone();
  const isSuccessful = res.status.toString().startsWith('2');

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

export function ensureSlash(path: string) {
  return path.startsWith('/') ? path : '/' + path;
}