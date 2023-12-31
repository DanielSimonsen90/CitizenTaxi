import { useRef } from "react";
import { Button } from "danholibraryrjs";
import { useNavigate } from "react-router-dom";

import { useBookings, useCitizen } from "providers/CitizenProvider";
import { Booking } from "models/backend/common";
import Modal from "components/shared/Modal";
import { DeleteBookingModalContent } from "components/shared/Modal/components";
import { useModalContentState } from "components/shared/Modal/ModalHooks";
import { useApiActions } from "hooks";

import BookingItem from "../BookingItem";

export default function BookingDashboard() {
  // All of these hooks receive "false" as a parameter, 
  // which means that they will be interpreted as non-nullable values.
  const [latestBooking, allBookings] = useBookings(false);
  
  const { citizen, setCitizen } = useCitizen(true);
  const dispatch = useApiActions({ setCitizen });

  // We use a ref to the modal so we can call the showModal() and close() methods
  const modalRef = useRef<HTMLDialogElement>(null);

  // We use a custom hook to store the modal content in the state
  // This is to dynamically change the modal content when the user clicks on a booking
  const [ModalContent, setModalContent] = useModalContentState();

  // Navigator function from react-router-dom to navigate to a different page
  const navigate = useNavigate();

  /**
   * Navigates the citizen to the step-by-step booking process with the selected booking.
   * @param booking The booking to change
   */
  const onChangeBooking = ({arrival, ...booking}: Booking) => {
    const [date, timeString] = arrival.toISOString().split('T');
    const [hour, minute] = timeString.split(':').map(Number);
    const format = (num: number) => `${num}`.padStart(2, '0');
    const time = `${format(hour)}:${format(minute)}`;

    navigate(`/bestil/1?bookingId=${booking.id}&booking=${JSON.stringify({ 
      ...booking, date, time 
    })}`);
  }

  /**
   * Shows the modal with the DeleteBookingModalContent component.
   * If the user confirms the deletion, the booking will be deleted from the API
   * and the citizen will be updated.
   * @param booking The booking to delete
   */
  function onDeleteBooking(booking: Booking) {
    setModalContent(<DeleteBookingModalContent
      booking={booking} citizen={citizen ?? undefined}
      onCancel={() => modalRef.current?.close()}
      onConfirm={async () => {
        // When the citizen submits the form:
        // close the modal, delete the booking item and update the citizen
        modalRef.current?.close();
        await dispatch('deleteBooking', booking.id);
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
        <Button className="alt" 
          disabled={!citizen?.note} title={!citizen?.note ? "Du skal have et notat for at kunne bestille en tid." : undefined}
          onClick={() => citizen?.note && navigate('bestil/1')}>Bestil en ny tid</Button>
      </header>

      <main role="list">
        {allBookings.length === 0 && <p className="muted" style={{
          justifySelf: 'start'
        }}>Du har ingen bestillinger endnu.</p>}

        {/* Map through all bookings, ordered by day */}
        {allBookings.map(bookings => (
          <ul key={bookings[0].arrival.getDate()} data-date={bookings[0].arrival.getDate()}>
            {bookings.map(booking => (
              <BookingItem key={booking.id} booking={booking} isLatest={booking.id === latestBooking.id}
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