import { BookingDashboard, CitizenNote } from "./components";

export default function Citizen() {
  return (
    <div className="citizens-page">
      <BookingDashboard />
      <CitizenNote />
    </div>
  );
}