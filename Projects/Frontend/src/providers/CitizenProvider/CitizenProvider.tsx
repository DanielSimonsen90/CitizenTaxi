import { PropsWithChildren, useMemo, useState } from 'react';
import { useAsyncEffect } from 'danholibraryrjs';

import { Nullable } from 'types';
import { Booking, Citizen, Note } from 'models/backend/common';

import { CitizenProviderContext, RequestBookings, RequestNote } from './CitizenProviderConstants';

export default function CitizenProviderProvider({ children }: PropsWithChildren) {
  const [citizen, setCitizen] = useState<Nullable<Citizen>>(null);
  const [bookings, setBookings] = useState<Array<Booking>>([]);
  const [note, setNote] = useState<Nullable<Note>>(null);

  const latestBooking = useMemo(() => bookings.sort((a, b) => 
    a.arrival.getTime() - b.arrival.getTime()
  )[0], [bookings]);

  useAsyncEffect(async () => {
    const note = await RequestNote(citizen?.id);
    const bookings = await RequestBookings(citizen?.id);

    setNote(note);
    setBookings(bookings ?? []);
  }, [citizen]);

  return (
    <CitizenProviderContext.Provider value={{
      citizen, bookings, note, 
      setCitizen, latestBooking
    }}>
      {children}
    </CitizenProviderContext.Provider>
  );
}