import { useMemo, useState } from 'react';
import { useAsyncEffect } from 'danholibraryrjs';

import { Nullable } from 'types';
import { Booking, Citizen, Note, Role } from 'models/backend/common';

import { useAuth } from 'providers/AuthProvider';
import { CitizenProviderContext } from './CitizenProviderConstants';
import { CitizenProviderProps } from './CitizenProviderTypes';
import { useApiActions } from 'hooks/useApiActions';

export default function CitizenProviderProvider({ children, citizen: defaultValue }: CitizenProviderProps) {
  const { user } = useAuth(false);
  const [citizen, setCitizen] = useState<Nullable<Citizen>>(defaultValue ?? null);
  const [allBookings, setBookings] = useState<Array<Booking>>([]);
  const [note, setNote] = useState<Nullable<Note>>(null);
  const dispatch = useApiActions({ allBookings, setBookings, setCitizen, setNote });

  const [latestBooking, bookings] = useMemo(() => {
    if (!allBookings.length) return [null, []];

    const [latest, ...rest] = allBookings.sort((a, b) =>
      // Order by today, future and past
      a.arrival.getTime() < Date.now() ? 1 :
      b.arrival.getTime() < Date.now() ? -1 :
      0 
    );

    return [latest, rest];
  }, [allBookings]);

  // Update citizen entities when citizen changes
  useAsyncEffect(async () => {
    if (!citizen?.id
      || citizen.role !== Role.Citizen) return;

    const note = await dispatch('getNote', citizen.id);
    const bookings = await dispatch('getBookings', citizen.id);

    setNote(note);
    setBookings(bookings);
  }, [citizen]);

  useAsyncEffect(async () => {
    // If the user is not yet loaded, we don't want to do anything yet
    if (!user?.id || defaultValue) return;

    // Get the citizen from the API and set it in the CitizenProvider
    const citizen = await dispatch('getCitizen', user?.id);
    if (citizen) setCitizen(citizen);
  }, [user?.id]);

  return (
    <CitizenProviderContext.Provider value={{
      citizen, setCitizen,
      note, setNote,
      bookings, latestBooking, allBookings, setBookings,
    }}>
      {children}
    </CitizenProviderContext.Provider>
  );
}