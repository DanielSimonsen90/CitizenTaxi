import { Button } from "danholibraryrjs";

import { BookingItem, CitizenNoteInputs } from "components/pages/Citizen/components";
import { Booking, Citizen } from "models/backend/common";
import { useBookings } from "providers/CitizenProvider";
import { BaseEntity } from "models/backend/common/dtos/BaseEntity";

type EntityOperations<TEntityName extends string, TEntity extends BaseEntity> = (
  Record<`onCreate${TEntityName}`, () => void>
  & Record<`onEdit${TEntityName}`, (entity: TEntity) => void>
  & Record<`onDelete${TEntityName}`, (entity: TEntity) => void>
);

export type EntityModifyFunctions =
  & Omit<EntityOperations<'Citizen', Citizen>, 'onCreateCitizen'>
  & EntityOperations<'Booking', Booking>
  & EntityOperations<'Note', any>
  & Record<'onViewAllBookings', () => void>;

type Props = EntityModifyFunctions & {
  citizen: Citizen;
  showAllBookings?: boolean;
};

export default function CitizenCard({
  citizen,
  showAllBookings,
  onEditCitizen, onDeleteCitizen,
  onViewAllBookings, onCreateBooking, onEditBooking, onDeleteBooking,
  onCreateNote, onEditNote, onDeleteNote
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
        <header>
          <h2>Borgerens næste bestilling</h2>
          <Button importance="secondary" crud="create" onClick={() => {
            onCreateBooking();
          }}>Book en taxa</Button>
        </header>
        {latestBooking ?
          <ul>
            <BookingItem booking={latestBooking} isLatest
              onViewAllBookings={onViewAllBookings}
              onChangeBooking={onEditBooking ? () => onEditBooking(latestBooking) : null}
              onDeleteBooking={onDeleteBooking ? () => onDeleteBooking(latestBooking) : null}
            />
            {showAllBookings
              && bookings
              && bookings.length > 0
              && bookings.map(bookings => (
                <ul key={bookings[0].arrival.getDate()}>
                  {bookings.map(booking => (
                    <BookingItem key={booking.id} booking={booking} isLatest={booking.id === latestBooking?.id}
                      onChangeBooking={onEditBooking ? () => onEditBooking(booking) : null}
                      onDeleteBooking={onDeleteBooking ? () => onDeleteBooking(booking) : null}
                    />
                  ))}
                </ul>
              ))
            }
          </ul>
          : <p className="muted">Borgeren har ingen bestillinger.</p>
        }
      </section>

      <section className="citizen-card__note">
        <h2>Borgerens notat</h2>
        {note
          ? (
            <>
              <CitizenNoteInputs />
              <div className="button-container">
                <Button type="button" importance="secondary" crud="delete" onClick={onDeleteNote}>Slet notat</Button>
                <Button type="button" importance="secondary" crud="update" onClick={onEditNote}>Redigér notat</Button>
              </div>
            </>
          )
          : (
            <>
              <p className="muted">Borgeren har ingen note.</p>
              <div className="button-container">
                <Button type="button" crud="create" onClick={onCreateNote}>Tilføj notat</Button>
              </div>
            </>
          )
        }
      </section>

      <footer className="button-container">
        <Button type="button" importance="secondary" crud="delete"
          onClick={() => onDeleteCitizen(citizen)}
        >Slet borger</Button>
        <Button type="button" importance="secondary" crud="update"
          onClick={() => onEditCitizen(citizen)}
        >Redigér borger</Button>
      </footer>
    </article>
  );
}