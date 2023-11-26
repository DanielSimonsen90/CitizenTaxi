import { useContext } from "react";

import { Booking } from "models/backend/common";
import { showNotification } from "utils";

import { CitizenProviderContext } from "./CitizenProviderConstants";
import { 
  CitizenProviderContextType, 
  NullableCitizenProviderContextType, 
  TimeLeft, UseBookingsReturnType
} from './CitizenProviderTypes';
import { useUpdateEffect } from "danholibraryrjs";

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

/**
 * Sends notifications to the user when the taxi is about to arrive
 * @param booking The booking to get the notifications for
 */
export function useBookingNotifications(booking?: Booking) {
  useUpdateEffect(() => {
    if (!booking) return;

    const timeout = notifyOnInterval(booking);
    notify(getTimeLeft(booking));

    return () => {
      if (timeout) clearTimeout(timeout);
    };

  }, [booking]);
}

function notifyOnInterval(booking: Booking) {
  const timeToWait = getTimeToWait(booking);
  if (!timeToWait) return undefined;

  const timeout = setTimeout(() => {
    notify(getTimeLeft(booking));
    notifyOnInterval(booking);
  }, timeToWait);

  return timeout;
}

/**
 * Get the time left before the taxi arrives
 * @param booking The booking to get the time left for
 * @returns The time left before the taxi arrives
 */
function getTimeLeft(booking: Booking): TimeLeft {
  const nowUtc = Date.now() - new Date().getTimezoneOffset() * 60 * 1000;
  const ms = booking.arrival.getTime() - nowUtc;
  const seconds = ms / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;

  const timeLeft = {
    seconds: Math.floor(seconds % 60),
    minutes: Math.floor(minutes % 60),
    hours: Math.floor(hours)
  };

  return timeLeft;
};

/**
 * Get the time to wait before notifying the user
 * @returns The time to wait before notifying the user
 */
function getTimeToWait(booking: Booking) {
  const timeLeft = getTimeLeft(booking);

  // If timeLeft.hours > 1, notify when there's an hour left
  if (timeLeft.hours > 1) return (timeLeft.hours - 1) * 60 * 60 * 1000;

  // If timeLeft.minutes > 15, notify every 15 minutes
  if (timeLeft.minutes > 15) return (timeLeft.minutes - 15) * 60 * 1000;

  // If timeLeft.minutes > 5, notify every 5 minutes
  if (timeLeft.minutes > 5) return (timeLeft.minutes - 5) * 60 * 1000;

  // Return the remaining time left
  const remainingTime = timeLeft.minutes * 60 * 1000 + timeLeft.seconds * 1000;
  return remainingTime > 0 ? remainingTime : undefined;
}

/**
 * Notify the user about the time left before the taxi arrives
 * @param timeLeft The time left
 */
function notify(timeLeft: TimeLeft) {
  const timeString = timeLeft.hours > 0 ? `${timeLeft.hours} timer`
    : timeLeft.minutes > 0 ? `${timeLeft.minutes} minutter`
    : timeLeft.seconds > 1 ? `${timeLeft.seconds} sekunder`
    : timeLeft.minutes < -5 ? undefined
    : null;

  const message = timeString === null ? 'Din taxa ankommer snart'
    : timeString === undefined ? ''
    : `Din taxa ankommer om ${timeString}`;
  showNotification({ message });
}