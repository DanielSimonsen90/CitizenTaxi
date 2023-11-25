import { Button } from "danholibraryrjs";
import { Booking } from "models/backend/common";
import { dateToString } from "utils";

type Props = {
  /** The booking to display */
  booking: Booking;
  /** Whether or not this is the latest booking */
  isLatest: boolean;

  /** Callback for when the user clicks on the "Ændre bestilling" button */
  onChangeBooking?: () => void;
  /** Callback for when the user clicks on the "Afbestil" button */
  onDeleteBooking?: () => void;
};

export default function BookingItem({
  // Destructure the booking object for easier access to the properties
  booking: { id, pickup, destination, arrival },
  isLatest,
  onChangeBooking, onDeleteBooking
}: Props) {
  return (
    <li id={id} className="booking-item" data-is-latest={isLatest}>
      <label className="booking-to-destination">Til {destination}</label>
      <time className="booking-arrival" dateTime={arrival.toISOString()}>{dateToString(arrival)}</time>
      <label className="booking-from-pickup">Fra {pickup}</label>
      {/* 
        If onChangeBooking and onDeleteBooking are null, don't render the footer 
        This is used in shared/Modal/components/DeleteBookingModalContent to hide the buttons
      */}
      {onChangeBooking || onDeleteBooking ? (
        <footer className="button-container">
          {onChangeBooking && <Button importance='primary' crud="update" onClick={onChangeBooking}>Ændre bestilling</Button>}
          {onDeleteBooking && <Button importance="secondary" crud="delete" onClick={onDeleteBooking}>Afbestil</Button>}
        </footer>
      ) : null}
    </li>
  );
}