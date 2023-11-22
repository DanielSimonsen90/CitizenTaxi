import { Booking, Citizen, Note } from "models/backend/common";
import { PropsWithChildren } from "react";
import { Nullable } from "types";

export type CitizenProviderContextType = {
  citizen: Citizen;
  note: Note;
  bookings: Array<Booking>;
  latestBooking: Booking;

  setCitizen: (citizen: Citizen) => void;
};

export type CitizenProviderProps = PropsWithChildren & {
  citizen?: Nullable<Citizen>;
}

// TypeScript can map over types, so we can use this to make all the values in the context nullable aside from functions
export type NullableCitizenProviderContextType = {
  [key in keyof CitizenProviderContextType]: 
    CitizenProviderContextType[key] extends Function 
      ? CitizenProviderContextType[key] 
      : Nullable<CitizenProviderContextType[key]>;
}

// UseBookingsReturn that supports the AllowNullable generic 
export type UseBookingsReturnType<AllowNullable extends boolean> =
  AllowNullable extends true
    ? [Nullable<Booking>, Nullable<Array<Array<Booking>>>] // [latestBooking, [day1 bookings, day2 bookings, ...]]
    : [Booking, Array<Array<Booking>>];

export type TimeLeft = {
  hours: number;
  minutes: number;
  seconds: number;
}