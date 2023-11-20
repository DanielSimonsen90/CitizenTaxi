import { useContext } from "react";
import { CitizenProviderContext } from "./CitizenProviderConstants";
import { CitizenProviderContextType, NullableCitizenProviderContextType, UseBookingsReturnType } from './CitizenProviderTypes'
import { Booking } from "models/backend/common";

/**
 * The hook to get the CitizenProviderContext data
 * @param allowNullable Force TypeScript to interpret the return type as nullable or not
 * @returns The CitizenProviderContextType, which is the context for the CitizenProvider
 */
export function useCitizen<AllowNullable extends boolean>(
  allowNullable: AllowNullable
): AllowNullable extends true 
  ? NullableCitizenProviderContextType 
  : CitizenProviderContextType 
{
  return useContext(CitizenProviderContext) as any;
} 

/**
 * Get the citizen's bookings sorted by day
 * @param allowNullable Force TypeScript to interpret the return type as nullable or not
 * @returns The latest booking and an array of bookings sorted by day
 */
export function useBookings<AllowNullable extends boolean = true>(
  allowNullable: AllowNullable = true as AllowNullable
): UseBookingsReturnType<AllowNullable> {
  const { bookings, latestBooking } = useCitizen(allowNullable);
  
  const sortedBookingsByDay = bookings?.reduce((acc, booking) => {
    const day = new Date(booking.arrival).getDay();
    acc[day] = acc[day] || [];
    acc[day].push(booking);
    return acc;
  }, [] as Array<Array<Booking>>) || [];

  return [latestBooking, sortedBookingsByDay] as any;
}