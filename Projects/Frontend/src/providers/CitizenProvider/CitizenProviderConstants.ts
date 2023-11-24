import { createContext } from "react";
import { NullableCitizenProviderContextType } from "./CitizenProviderTypes";
import { Guid } from "types";
import { RequestEntity, RequestOptions } from "utils";
import { Booking, Citizen, Note } from "models/backend/common";

/**
 * The context for the CitizenProvider
 * A context in React is like a service, that can be used by any child component, without having to pass it down as a prop
 */
export const CitizenProviderContext = createContext<NullableCitizenProviderContextType>({
  citizen: null,
  allBookings: null,
  bookings: null,
  latestBooking: null,
  note: null,

  setCitizen: () => { },
});

// Pre-define the API calls instead of using the RequestEntity function directly
export const RequestNote = async (citizenId?: Guid) => citizenId ? RequestEntity<Note>(`notes`, citizenId) : null;
export const RequestCitizen = async (citizenId?: Guid) => citizenId ? RequestEntity<Citizen>(`users/${citizenId}`) : null;
export const RequestBookings = async (citizenId?: Guid, options?: RequestOptions) => citizenId
  ? RequestEntity<Array<Booking>>(
    options?.body?.id ? `bookings/${options.body.id}` : 'bookings',
    citizenId,
    options
  ).then(booking => {
    if (booking && booking instanceof Array) {
      // Convert the arrival date to a Date object, because it arrives as a string
      return booking.map(b => ({
        ...b,
        arrival: new Date(b.arrival),
      }));
    }
  }) : null;