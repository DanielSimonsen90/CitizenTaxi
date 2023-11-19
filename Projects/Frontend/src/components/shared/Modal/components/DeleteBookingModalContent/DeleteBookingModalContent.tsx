import { Button } from "danholibraryrjs";
import { Booking, Citizen } from "models/backend/common";
import { useAuth } from "providers/AuthProvider";
import BookingItem from "../../../../pages/Citizen/components/BookingItem/BookingItem";

type Props = {
  booking: Booking;
  citizen: Citizen;

  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteBookingModalContent({ booking, citizen, onCancel, onConfirm }: Props) {
  const { user } = useAuth(false);
  const isCitizen = user.id === citizen.id;
  
  return (
    <div className="delete-booking">
      <h1>Du er ved at afbestille {isCitizen ? 'din' : `${citizen.name}s`} taxa.</h1>
      <p className="secondary">Er du sikker på at du vil afbestille?</p>
      <BookingItem booking={booking} isLatest={false} onChangeBooking={null} onDeleteBooking={null} />
      <p className="muted">Denne handling kan ikke fortrydes.</p>
      <footer className="button-container">
        <Button importance="tertiary" className="alt" onClick={onCancel}>Fortryd</Button>
        <Button importance="secondary" crud="delete" onClick={onConfirm}>Afbestil</Button>
      </footer>
    </div>
  );
}