// An ApiEndpoint paramter can be either a string or undefined
export type TParam = string | undefined;

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
