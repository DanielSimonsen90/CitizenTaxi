import { Button } from "danholibraryrjs";
import { Booking } from "models/backend/common";
import { Nullable } from "types";

type Props = {
  /** The booking to display */
  booking: Booking;
  /** Whether or not this is the latest booking */
  isLatest: boolean;

  /** Whether or not to show the "View all bookings" button */
  onViewAllBookings?: () => void;
  /** Callback for when the user clicks on the "Ændre bestilling" button */
  onChangeBooking: Nullable<() => void>;
  /** Callback for when the user clicks on the "Afbestil" button */
  onDeleteBooking: Nullable<() => void>;
}

export default function BookingItem({ 
  // Destructure the booking object for easier access to the properties
  booking: { id, pickup, destination, arrival }, 
  isLatest, 
  onChangeBooking, onDeleteBooking, onViewAllBookings
}: Props) {
  return (
    <li id={id} className="booking-item" data-is-latest={isLatest}>
      <header>
        <label>Til {destination}</label>
        <time dateTime={arrival.toISOString()}>{arrival.toLocaleString("en-UK")}</time>
      </header>
      <section>
        <label>Fra {pickup}</label>
      </section>
      {/* 
        If onChangeBooking and onDeleteBooking are null, don't render the footer 
        This is used in shared/Modal/components/DeleteBookingModalContent to hide the buttons
      */}
      {onChangeBooking || onDeleteBooking ? (
        <footer className="button-container">
          {onChangeBooking && <Button importance={onViewAllBookings ? 'secondary' : 'primary'} crud="update" onClick={onChangeBooking}>Ændre bestilling</Button>}
          {onDeleteBooking && <Button importance="secondary" crud="delete" onClick={onDeleteBooking}>Afbestil</Button>}
          {onViewAllBookings && <Button importance="secondary" className="alt" onClick={onViewAllBookings}>Se alle bestillinger</Button>}
        </footer>
      ) : null}
    </li>
  );
}