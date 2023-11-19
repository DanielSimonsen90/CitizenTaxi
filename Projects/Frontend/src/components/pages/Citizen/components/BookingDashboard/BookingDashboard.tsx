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
  // All of these hooks receive "false" as a parameter, 
  // which means that they will be interpreted as non-nullable values.
  const [latest, allBookings] = useBookings(false);
  const { citizen, setCitizen } = useCitizen(false);

  // We use a ref to the modal so we can call the showModal() and close() methods
  const modalRef = useRef<HTMLDialogElement>(null);

  // We use a custom hook to store the modal content in the state
  // This is to dynamically change the modal content when the user clicks on a booking
  const [ModalContent, setModalContent] = useModalContentState()

  // TODO: Implement onChangeBooking
  function onChangeBooking(booking: Booking) {
    console.log("TODO: Implement onChangeBooking");
  }

  /**
   * Shows the modal with the DeleteBookingModalContent component.
   * If the user confirms the deletion, the booking will be deleted from the API
   * and the citizen will be updated.
   * @param booking The booking to delete
   */
  function onDeleteBooking(booking: Booking) {
    setModalContent(<DeleteBookingModalContent 
      booking={booking} citizen={citizen} 
      onCancel={() => modalRef.current?.close()} 
      onConfirm={async () => {
        // When the citizen submits the form:
        // close the modal, delete the booking item and update the citizen
        modalRef.current?.close();
        await RequestEntity(`bookings/${booking.id}`, citizen.id, { method: "DELETE" });
        const updatedCitizen = await RequestCitizen(citizen.id);
        if (updatedCitizen) setCitizen(updatedCitizen);
      }}
    />);

    // Show the modal
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
        {/* Map through all bookings, ordered by day */}
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