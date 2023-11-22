import { Button } from "danholibraryrjs";

import { BookingItem, CitizenNoteInputs } from "components/pages/Citizen/components";
import { Citizen } from "models/backend/common";
import { useBookings } from "providers/CitizenProvider";

type Props = {
  citizen: Citizen;
  showAllBookings?: boolean;
};

export default function CitizenCard({ citizen: { name, email, note }, showAllBookings }: Props) {
  const [latestBooking, bookings] = useBookings();

  return (
    <article className="citizen-card" role="listitem">
      <header>
        <h1>{name}</h1>
        {email ? <a href={`mailto:${email}`}>{email}</a> : <p className="muted">Borgeren har ingen email.</p>}
      </header>

      <section className="citizen-card__bookings">
        <h2>Borgerens næste bestilling</h2>
        <ul>
          {latestBooking
            ? <BookingItem booking={latestBooking} isLatest
              onViewAllBookings={() => console.log('onViewAll')}
              onChangeBooking={() => console.log('onChange')}
              onDeleteBooking={() => console.log('onDelete')}
            />
            : <p className="muted">Borgeren har ingen bestillinger.</p>
          }
          {showAllBookings && bookings && bookings.length > 0 && bookings.map(bookings => (
            <ul key={bookings[0].arrival.getDate()}>
              {bookings.map(booking => (
                <BookingItem key={booking.id} booking={booking} isLatest={booking.id === latestBooking?.id}
                  onChangeBooking={() => console.log('onChange')}
                  onDeleteBooking={() => console.log('onDelete')}
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
          <Button type="button" importance="secondary" crud="delete">Slet notat</Button>
          <Button type="button" importance="secondary" crud="update">Redigér notat</Button>
        </div>
      </section>
    </article>
  );
}