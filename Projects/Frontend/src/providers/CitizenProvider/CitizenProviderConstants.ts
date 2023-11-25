import { createContext } from "react";
import { NullableCitizenProviderContextType } from "./CitizenProviderTypes";

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