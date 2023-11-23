import { RefObject, useState } from "react";
import { Button, FunctionComponent } from "danholibraryrjs";

import { BookingItem, CitizenNoteInputs } from "components/pages/Citizen/components";
import { Booking, Citizen } from "models/backend/common";
import { BaseEntity } from "models/backend/common/dtos/BaseEntity";
import { useBookings } from "providers/CitizenProvider";

import { useBookingModals, useCitizenModals, useNoteModals } from "../../pages/AdminOverviewHooks";

type EntityOperations<TEntityName extends string, TEntity extends BaseEntity> = (
  Record<`onCreate${TEntityName}`, () => void>
  & Record<`onEdit${TEntityName}`, (entity: TEntity) => void>
  & Record<`onDelete${TEntityName}`, (entity: TEntity) => void>
);

export type EntityModifyFunctions =
  & Omit<EntityOperations<'Citizen', Citizen>, 'onCreateCitizen'>
  & EntityOperations<'Booking', Booking>
  & EntityOperations<'Note', any>;

type ModalOpenProps = {
  modal: FunctionComponent;
  modalRef: RefObject<HTMLDialogElement>;
};

type Props = {
  citizen: Citizen;
  onModalOpen: (props: ModalOpenProps) => void;
};

export default function CitizenCard({ citizen, onModalOpen }: Props) {
  const [latestBooking, bookings] = useBookings();
  const [showAllBookings, setShowAllBookings] = useState(false);

  const {
    createBookingModalRef, CreateBookingModal,
    editBookingModalRef, EditBookingModal,
    deleteBookingModalRef, DeleteBookingModal
  } = useBookingModals();
  const {
    createNoteModalRef, CreateNoteModal,
    editNoteModalRef, EditNoteModal,
    deleteNoteModalRef, DeleteNoteModal
  } = useNoteModals();

  const {
    editCitizenModalRef, EditCitizenModal,
    deleteCitizenModalRef, DeleteCitizenModal
  } = useCitizenModals();

  const { name, email, note } = citizen;

  return (
    <article className="citizen-card" role="listitem" data-citizen-id={citizen.id}>
      <header>
        <h1>{name}</h1>
        {email ? <a href={`mailto:${email}`}>{email}</a> : <p className="muted">Borgeren har ingen email.</p>}
      </header>

      <section className="citizen-card__bookings">
        <header>
          <h2>Borgerens næste bestilling</h2>
          <Button importance="secondary" crud="create" onClick={() => onModalOpen({
            modal: CreateBookingModal,
            modalRef: createBookingModalRef
          })}>Book en taxa</Button>
        </header>
        {latestBooking ?
          <ul className="bookings-list">
            <BookingItem booking={latestBooking} isLatest
              onViewAllBookings={() => setShowAllBookings(v => !v)}
              onChangeBooking={() => onModalOpen({ modal: EditBookingModal, modalRef: editBookingModalRef })}
              onDeleteBooking={() => onModalOpen({ modal: DeleteBookingModal, modalRef: deleteBookingModalRef })}
            />
            {showAllBookings
              && bookings
              && bookings.length > 0
              && bookings.map(bookings => (
                <ul key={bookings[0].arrival.getDate()}>
                  {bookings.map(booking => (
                    <BookingItem key={booking.id} booking={booking} isLatest={booking.id === latestBooking?.id}
                      onChangeBooking={() => onModalOpen({ modal: EditBookingModal, modalRef: editBookingModalRef })}
                      onDeleteBooking={() => onModalOpen({ modal: DeleteBookingModal, modalRef: deleteBookingModalRef })}
                      onViewAllBookings={() => setShowAllBookings(v => !v)}
                    />
                  ))}
                </ul>
              ))
            }
          </ul>
          : <p className="muted">Borgeren har ingen bestillinger.</p>
        }
      </section>

      <section className="citizen-card__note">
        <h2>Borgerens notat</h2>
        {note
          ? (
            <>
              <CitizenNoteInputs />
              <div className="button-container">
                <Button type="button" importance="secondary" crud="delete"
                  onClick={() => onModalOpen({
                    modal: () => <DeleteNoteModal modalRef={deleteNoteModalRef} selected={note} selectedCitizen={citizen} />,
                    modalRef: deleteNoteModalRef
                  })}
                >Slet notat</Button>
                <Button type="button" importance="secondary" crud="update" onClick={() => onModalOpen({
                  modal: () => <EditNoteModal modalRef={editNoteModalRef} selected={note} selectedCitizen={citizen} />,
                  modalRef: editNoteModalRef
                })}>Redigér notat</Button>
              </div>
            </>
          )
          : (
            <>
              <p className="muted">Borgeren har ingen note.</p>
              <div className="button-container">
                <Button type="button" crud="create" onClick={() => onModalOpen({
                  modal: () => <CreateNoteModal modalRef={createNoteModalRef} selectedCitizen={citizen} />,
                  modalRef: createNoteModalRef
                })}>Tilføj notat</Button>
              </div>
            </>
          )
        }
      </section>

      <footer className="button-container">
        <Button type="button" importance="secondary" crud="delete"
          onClick={() => onModalOpen({
            modal: () => <DeleteCitizenModal modalRef={deleteCitizenModalRef} selected={citizen} />,
            modalRef: deleteCitizenModalRef
          })}
        >Slet borger</Button>
        <Button type="button" importance="secondary" crud="update"
          onClick={() => onModalOpen({
            modal: () => <EditCitizenModal modalRef={editCitizenModalRef} selected={citizen} />,
            modalRef: editCitizenModalRef
          })}
        >Redigér borger</Button>
      </footer>
    </article>
  );
}