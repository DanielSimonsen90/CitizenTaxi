import { Button } from "danholibraryrjs";

import { BookingItem, CitizenNoteInputs } from "components/pages/Citizen/components";
import { Booking, Citizen } from "models/backend/common";
import { useBookings } from "providers/CitizenProvider";

export type EntityModifyFunctions = 
  Record<`on${'Change' | 'Delete'}Booking`, (booking: Booking) => void>
  & Record<`on${'Change' | 'Delete'}Note`, () => void>
  & Record<'onViewAllBookings', () => void>;

type Props = EntityModifyFunctions & {
  citizen: Citizen;
  showAllBookings?: boolean;
};

export default function CitizenCard({ 
  citizen, 
  showAllBookings,
  onViewAllBookings, onChangeBooking, onDeleteBooking,
  onChangeNote, onDeleteNote
}: Props) {
  const [latestBooking, bookings] = useBookings();
  const { name, email, note } = citizen;

  return (
    <article className="citizen-card" role="listitem" data-citizen-id={citizen.id}>
      <header>
        <h1>{name}</h1>
        {email ? <a href={`mailto:${email}`}>{email}</a> : <p className="muted">Borgeren har ingen email.</p>}
      </header>

      <section className="citizen-card__bookings">
        <h2>Borgerens næste bestilling</h2>
        <ul>
          {latestBooking
            ? <BookingItem booking={latestBooking} isLatest
              onViewAllBookings={onViewAllBookings}
              onChangeBooking={onChangeBooking ? () => onChangeBooking(latestBooking) : null}
              onDeleteBooking={onDeleteBooking ? () => onDeleteBooking(latestBooking) : null}
            />
            : <p className="muted">Borgeren har ingen bestillinger.</p>
          }
          {showAllBookings 
            && bookings 
            && bookings.length > 0 
            && bookings.map(bookings => (
            <ul key={bookings[0].arrival.getDate()}>
              {bookings.map(booking => (
                <BookingItem key={booking.id} booking={booking} isLatest={booking.id === latestBooking?.id}
                  onChangeBooking={onChangeBooking ? () => onChangeBooking(booking) : null}
                  onDeleteBooking={onDeleteBooking ? () => onDeleteBooking(booking) : null}
                />
              ))}
            </ul>
          ))}
        </ul>
      </section>

      <section className="citizen-card__note">
        <h2>Borgerens notat</h2>
        {note
          ? <CitizenNoteInputs />
          : <p className="muted">Borgeren har ingen note.</p>
        }
        <div className="button-container">
          <Button type="button" importance="secondary" crud="delete" onClick={onDeleteNote}>Slet notat</Button>
          <Button type="button" importance="secondary" crud="update" onClick={onChangeNote}>Redigér notat</Button>
        </div>
      </section>
    </article>
  );
}