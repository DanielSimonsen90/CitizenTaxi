import { createContext } from "react";
import { NullableCitizenProviderContextType } from "./CitizenProviderTypes";
import { Guid } from "types";
import { RequestEntity } from "utils";
import { Booking, Citizen, Note } from "models/backend/common";

export const CitizenProviderContext = createContext<NullableCitizenProviderContextType>({
  citizen: null,
  bookings: null,
  latestBooking: null,
  note: null,

  setCitizen: () => { },
});

export const RequestNote = async (citizenId?: Guid) => citizenId ? RequestEntity<Note>(`notes`, citizenId) : null;
export const RequestCitizen = async (citizenId?: Guid) => citizenId ? RequestEntity<Citizen>(`users/${citizenId}`) : null;
export const RequestBookings = async (citizenId?: Guid) => citizenId ? RequestEntity<Array<Booking>>(`bookings`, citizenId).then(booking => {
  if (booking) {
    // Convert the arrival date to a Date object, because it arrives as a string
    return booking.map(b => ({
      ...b,
      arrival: new Date(b.arrival),
    }))
  }
}) : null;