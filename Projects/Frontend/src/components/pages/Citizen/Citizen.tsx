import { useBookingNotifications, useBookings } from "providers/CitizenProvider";
import { BookingDashboard, CitizenNote } from "./components";

export default function Citizen() {
  const [latestBooking] = useBookings(true);
  useBookingNotifications(latestBooking ?? undefined);

  return (
    <div className="citizens-page">
      <BookingDashboard />
      <CitizenNote />
    </div>
  );
}