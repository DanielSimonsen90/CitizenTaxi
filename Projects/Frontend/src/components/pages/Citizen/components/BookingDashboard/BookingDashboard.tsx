import { useRef } from "react";
import { Button } from "danholibraryrjs";

import { RequestCitizen, useBookings, useCitizen } from "providers/CitizenProvider";
import { Booking } from "models/backend/common";

import Modal from "components/shared/Modal";
import { DeleteBookingModalContent } from "components/shared/Modal/components";

import BookingItem from "../BookingItem";
import { useModalContentState } from "components/shared/Modal/ModalHooks";
import { RequestEntity } from "utils";

export default function BookingDashboard() {
  const [latest, allBookings] = useBookings(false);
  const { citizen, setCitizen } = useCitizen(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const [ModalContent, setModalContent] = useModalContentState()

  function onChangeBooking(booking: Booking) {
    console.log("TODO: Implement onChangeBooking");
  }
  function onDeleteBooking(booking: Booking) {
    setModalContent(<DeleteBookingModalContent 
      booking={booking} citizen={citizen} 
      onCancel={() => modalRef.current?.close()} 
      onConfirm={async () => {
        modalRef.current?.close();
        await RequestEntity(`bookings/${booking.id}`, citizen.id, { method: "DELETE" });
        const updatedCitizen = await RequestCitizen(citizen.id);
        if (updatedCitizen) setCitizen(updatedCitizen);
      }}
    />);
    modalRef.current?.showModal();
  }

  return (
    <div className="booking-dashboard">
      <Modal modalRef={modalRef}>
        <ModalContent />
      </Modal>
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