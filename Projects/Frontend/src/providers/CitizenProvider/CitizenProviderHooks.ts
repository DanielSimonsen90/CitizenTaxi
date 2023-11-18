import { useContext } from "react";
import { CitizenProviderContext } from "./CitizenProviderConstants";

export const useCitizen = () => useContext(CitizenProviderContext);
export const useBookings = () => {
  const { bookings, latestBooking } = useCitizen();
  return [latestBooking, bookings] as const;
}