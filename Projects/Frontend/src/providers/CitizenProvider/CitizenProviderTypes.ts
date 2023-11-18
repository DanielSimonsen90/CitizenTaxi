import { Booking, Citizen, Note } from "models/backend/common";
import { Nullable } from "types";

export type CitizenProviderContextType = {
  citizen: Citizen;
  note: Note;
  bookings: Array<Booking>;
  latestBooking: Booking;

  setCitizen: (citizen: Citizen) => void;
};

export type NullableCitizenProviderContextType = {
  [key in keyof CitizenProviderContextType]: 
    CitizenProviderContextType[key] extends Function 
      ? CitizenProviderContextType[key] 
      : Nullable<CitizenProviderContextType[key]>;
}

export type UseBookingsReturnType<AllowNullable extends boolean> =
  AllowNullable extends true
    ? [Nullable<Booking>, Nullable<Array<Array<Booking>>>] // [latestBooking, [day1 bookings, day2 bookings, ...]]
    : [Booking, Array<Array<Booking>>];