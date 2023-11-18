import { useContext } from "react";
import { CitizenProviderContext } from "./CitizenProviderConstants";
import { CitizenProviderContextType, NullableCitizenProviderContextType } from './CitizenProviderTypes'

export function useCitizen<AllowNullable extends boolean>(
  allowNullable: AllowNullable
): AllowNullable extends true 
  ? NullableCitizenProviderContextType 
  : CitizenProviderContextType 
{
  return useContext(CitizenProviderContext) as any;
} 
export const useBookings = (allowNullable = true) => {
  const { bookings, latestBooking } = useCitizen(true);
  return [latestBooking, bookings] as const;
}