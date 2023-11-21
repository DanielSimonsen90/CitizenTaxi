import { useContext, useEffect } from "react";
import { CitizenProviderContext } from "./CitizenProviderConstants";
import { CitizenProviderContextType, NullableCitizenProviderContextType, UseBookingsReturnType } from './CitizenProviderTypes'
import { Booking } from "models/backend/common";
import { useNotification } from "providers/NotificationProvider";

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

// Get booking arrival
// If booking arrival is more than an hour, get time to wait until there's an hour left
// When there's an hour left, send notification and send notification every 15 minutes
// until The last 15 minutes, then send notification 5 minutes
export function useLatestBookingNotifications(booking?: Booking) {
  const { setNotification } = useNotification();

  useEffect(() => {
    if (!booking) return console.warn('No booking');
    console.log('booking', booking);
    

    let timeout: NodeJS.Timeout;
    const { arrival } = booking;
    const now = new Date();

    const timeToWait = arrival.getTime() - now.getTime();
    if (timeToWait < 0) return setNotification({ message: '' });

    const timeToWaitInMinutes = Math.floor(timeToWait / 1000 / 60);
    const timeToWaitInHours = Math.floor(timeToWaitInMinutes / 60);

    const timeString = timeToWaitInHours > 1 ? `${timeToWaitInHours} timer` : `${timeToWaitInMinutes} minutter`;
    setNotification({ message: `Din taxa ankommer om ${timeString}.` });

    if (timeToWaitInHours > 1) {
      console.log('timeToWaitInHours', timeToWaitInHours)
      
      // Wait until there's an hour left
      timeout = setTimeout(() => {
        setNotification({ message: `Din taxa ankommer om ${timeToWaitInHours} timer` });
      }, timeToWait - (60 * 60 * 1000));
    } else if (timeToWaitInMinutes > 15) {
      console.log('timeToWaitInMinutes', timeToWaitInMinutes)

      // Send notification every 15 minutes
      const minutesLeft = timeToWaitInMinutes % 15;
      timeout = setInterval(() => {
        setNotification({ message: `Din taxa ankommer om ${minutesLeft} minutter` });
      }, 15 * 60 * 1000);
    } else if (timeToWaitInMinutes >= 5) {
      console.log('timeToWaitInMinutes', timeToWaitInMinutes)

      // Send notification every 5 minutes
      const minutesLeft = timeToWaitInMinutes % 5;
      timeout = setInterval(() => {
        setNotification({ message: `Din taxa ankommer om ${minutesLeft} minutter` });
      }, 5 * 60 * 1000);
    } else {
      console.log('timeToWaitInMinutes', timeToWaitInMinutes)
      setNotification({ message: `Din taxa ankommer om ${timeToWaitInMinutes} minutter` });
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(timeout);
    }
  }, [booking, setNotification]);
}