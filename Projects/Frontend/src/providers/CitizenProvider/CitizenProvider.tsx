import { useMemo, useState } from 'react';
import { useAsyncEffect } from 'danholibraryrjs';

import { Nullable } from 'types';
import { Citizen } from 'models/backend/common';
import { useApiActions } from 'hooks';
import { useAuth } from 'providers/AuthProvider';

import { CitizenProviderContext } from './CitizenProviderConstants';
import { CitizenProviderProps } from './CitizenProviderTypes';

export default function CitizenProviderProvider({ children, citizen: defaultValue }: CitizenProviderProps) {
  const { user } = useAuth(false);
  const [citizen, setCitizen] = useState<Nullable<Citizen>>(defaultValue ?? null);
  const dispatch = useApiActions({ setCitizen });

  const note = useMemo(() => citizen?.note ?? null, [citizen?.note]);
  const allBookings = useMemo(() => citizen?.bookings ?? [], [citizen?.bookings]);
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
      note,
      bookings, latestBooking, allBookings,
    }}>
      {children}
    </CitizenProviderContext.Provider>
  );
}