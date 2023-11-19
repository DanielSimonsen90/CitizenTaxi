import { Button } from "danholibraryrjs";
import { Booking } from "models/backend/common";
import { Nullable } from "types";

type Props = {
  booking: Booking;
  isLatest: boolean;
  onChangeBooking: Nullable<() => void>;
  onDeleteBooking: Nullable<() => void>;
}

export default function BookingItem({ 
  booking: { id, pickup, destination, arrival }, 
  isLatest,
  onChangeBooking, onDeleteBooking 
}: Props) {
  return (
    <li id={id} className="booking-item" data-is-latest={isLatest}>
      <header>
        <label>Til {destination}</label>
        <time dateTime={arrival.toISOString()}>{arrival.toLocaleString()}</time>
      </header>
      <section>
        <label>Fra {pickup}</label>
      </section>
      {onChangeBooking || onDeleteBooking ? (
        <footer className="button-container">
          {onChangeBooking && <Button crud="update" onClick={onChangeBooking}>Ændre bestilling</Button>}
          {onDeleteBooking && <Button importance="secondary" crud="delete" onClick={onDeleteBooking}>Slet bestilling</Button>}
        </footer>
      ) : null}
    </li>
  );
}