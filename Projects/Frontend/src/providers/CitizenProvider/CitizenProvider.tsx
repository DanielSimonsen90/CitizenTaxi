import { useMemo, useState } from 'react';
import { useAsyncEffect } from 'danholibraryrjs';

import { Nullable } from 'types';
import { Booking, Citizen, Note } from 'models/backend/common';

import { CitizenProviderContext, RequestBookings, RequestCitizen, RequestNote } from './CitizenProviderConstants';
import { useAuth } from 'providers/AuthProvider';
import { useBookingNotifications } from './CitizenProviderHooks';
import { CitizenProviderProps } from './CitizenProviderTypes';

export default function CitizenProviderProvider({ children, citizen: defaultValue }: CitizenProviderProps) {
  const { user } = useAuth(false);
  const [citizen, setCitizen] = useState<Nullable<Citizen>>(defaultValue ?? null);
  const [bookings, setBookings] = useState<Array<Booking>>([]);
  const [note, setNote] = useState<Nullable<Note>>(null);

  const latestBooking = useMemo(() => bookings.sort((a, b) => 
    // Order by today, future and past
    a.arrival.getTime() < Date.now() ? 1 :
    b.arrival.getTime() < Date.now() ? -1 :
    0
  )[0], [bookings]);

  // Update citizen entities when citizen changes
  useAsyncEffect(async () => {
    if (!citizen?.id) return;

    const note = await RequestNote(citizen.id);
    const bookings = await RequestBookings(citizen.id);

    setNote(note);
    setBookings(bookings ?? []);
  }, [citizen]);

  useAsyncEffect(async () => {
    // If the user is not yet loaded, we don't want to do anything yet
    if (!user?.id || defaultValue) return;

    // Get the citizen from the API and set it in the CitizenProvider
    const citizen = await RequestCitizen(user?.id);
    if (citizen) setCitizen(citizen);
  }, [user?.id]);

  useBookingNotifications(latestBooking);

  return (
    <CitizenProviderContext.Provider value={{
      citizen, bookings, note, 
      setCitizen, latestBooking
    }}>
      {children}
    </CitizenProviderContext.Provider>
  );
}