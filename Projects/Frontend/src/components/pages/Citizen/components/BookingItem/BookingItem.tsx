import { Button } from "danholibraryrjs";
import { Booking } from "models/backend/common";

type Props = {
  booking: Booking;
  isLatest: boolean;
  onChangeBooking: () => void;
  onDeleteBooking: () => void;
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
      <footer className="button-container">
        <Button crud="update" onClick={onChangeBooking}>Ændre bestilling</Button>
        <Button importance="secondary" crud="delete" onClick={onDeleteBooking}>Slet bestilling</Button>
      </footer>
    </li>
  );
}