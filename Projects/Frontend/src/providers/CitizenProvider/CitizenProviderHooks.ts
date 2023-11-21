import { useContext, useEffect } from "react";
import { CitizenProviderContext } from "./CitizenProviderConstants";
import { CitizenProviderContextType, NullableCitizenProviderContextType, TimeLeft, UseBookingsReturnType } from './CitizenProviderTypes';
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
  : CitizenProviderContextType {
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
  const getTimeLeft = (): TimeLeft => {
    const seconds = (booking!.arrival.getTime() - Date.now()) / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;

    return {
      seconds: Math.floor(seconds % 60),
      minutes: Math.floor(minutes % 60),
      hours: Math.floor(hours)
    };
  };

  useEffect(() => {
    if (!booking) return;

    const timeToWait = getTimeToWait();
    if (!timeToWait) return;

    const timeout = setTimeout(() => {
      notify(getTimeLeft());
      getTimeToWait();
    }, timeToWait);

    notify(getTimeLeft());

    return () => {
      if (timeout) clearTimeout(timeout);
    };

  }, [booking, setNotification]);

  function getTimeToWait() {
    const timeLeft = getTimeLeft();

    // If timeLeft.hours > 1, notify when there's an hour left
    if (timeLeft.hours > 1) return (timeLeft.hours - 1) * 60 * 60 * 1000;

    // If timeLeft.minutes > 15, notify every 15 minutes
    if (timeLeft.minutes > 15) return (timeLeft.minutes - 15) * 60 * 1000;

    // If timeLeft.minutes > 5, notify every 5 minutes
    if (timeLeft.minutes > 5) return (timeLeft.minutes - 5) * 60 * 1000;

    return booking!.arrival.getTime() - Date.now() + 1000;
  }

  function notify(timeLeft: TimeLeft) {
    const timeString = timeLeft.hours > 0 ? `${timeLeft.hours} timer`
      : timeLeft.minutes > 0 ? `${timeLeft.minutes} minutter`
      : timeLeft.seconds > 1 ? `${timeLeft.seconds} sekunder`
      : timeLeft.minutes < -5 ? undefined
      : null;

    const message = timeString === null ? 'Din taxa ankommer snart'
      : timeString === undefined ? ''
      : `Din taxa ankommer om ${timeString}` 
    setNotification({ message });
  }
}