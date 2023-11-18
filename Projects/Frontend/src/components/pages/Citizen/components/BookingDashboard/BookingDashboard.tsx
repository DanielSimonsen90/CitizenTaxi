import { Button } from "danholibraryrjs";
import { useBookings } from "providers/CitizenProvider";
import BookingItem from "../BookingItem";
import { Booking } from "models/backend/common";

export default function BookingDashboard() {
  const [latest, allBookings] = useBookings(false);

  function onChangeBooking(booking: Booking) {
    console.log("TODO: Implement onChangeBooking");
  }
  function onDeleteBooking(booking: Booking) {
    console.log("TODO: Implement onDeleteBooking");
  }

  return (
    <div className="booking-dashboard">
      <header>
        <h2>Dine bestillinger</h2>
        <Button className="alt">Bestil en ny tid</Button>
      </header>
      <main role="list">
        {allBookings.map(bookings => (
          <ul key={bookings[0].arrival.getDate()}>
            {bookings.map(booking => (
              <BookingItem key={booking.id} booking={booking} isLatest={booking.id === latest.id}
                onChangeBooking={() => onChangeBooking(booking)} 
                onDeleteBooking={() => onDeleteBooking(booking)}
              />
            ))}
          </ul>
        ))}
      </main>
    </div>
  );
}