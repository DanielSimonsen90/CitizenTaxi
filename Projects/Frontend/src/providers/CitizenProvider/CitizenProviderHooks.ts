import { useContext } from "react";
import { CitizenProviderContext } from "./CitizenProviderConstants";
import { CitizenProviderContextType, NullableCitizenProviderContextType, UseBookingsReturnType } from './CitizenProviderTypes'
import { Booking } from "models/backend/common";

export function useCitizen<AllowNullable extends boolean>(
  allowNullable: AllowNullable
): AllowNullable extends true 
  ? NullableCitizenProviderContextType 
  : CitizenProviderContextType 
{
  return useContext(CitizenProviderContext) as any;
} 
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