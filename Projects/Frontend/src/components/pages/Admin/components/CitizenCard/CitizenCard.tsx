import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { Button, FunctionComponent } from "danholibraryrjs";

import { BookingItem, CitizenNoteInputs } from "components/pages/Citizen/components";
import { Booking, Citizen } from "models/backend/common";
import { BaseEntity } from "models/backend/common/dtos/BaseEntity";
import { useBookings, useCitizen } from "providers/CitizenProvider";

import { useBookingModals, useCitizenModals, useNoteModals } from "../EntityModifyModal/AdminOverviewModalHooks";

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
  onModalOpen: (props: ModalOpenProps) => void;
  setCitizens: Dispatch<SetStateAction<Array<Citizen>>>;

  hideCitizens?: boolean;
  hideBookings?: boolean;
  hideNotes?: boolean;
};

export default function CitizenCard({ 
  onModalOpen, setCitizens, 
  hideCitizens, hideBookings, hideNotes 
}: Props) {
  const { citizen, note } = useCitizen(false);
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
  } = useCitizenModals({ setCitizens });

  if (!citizen) return null;
  
  const { name, email } = citizen;
  const [firstName] = name.split(' ');

  return (
    <article className="citizen-card" role="listitem" data-citizen-id={citizen.id}>
      <header>
        <h1>{name}</h1>
        {email
          ? <a href={`mailto:${email}`} onClick={e => {
            e.preventDefault();
            alert('Du kunne have sendt en email til borgeren via din mailapplikation. Da dette er en demo, er det ikke muligt.');
          }}>{email}</a>
          : <p className="muted">Borgeren har ingen email.</p>}
      </header>

      {!hideBookings && (
        <section className="citizen-card__bookings">
          <header>
            <h2>Borgerens næste bestilling</h2>
            <div className="button-container">
              {latestBooking && bookings && bookings.length > 0 && (
                <Button type="button" importance="secondary" className="alt"
                  onClick={() => setShowAllBookings(!showAllBookings)}
                >
                  {showAllBookings ? 'Vis seneste' : 'Vis alle'}
                </Button>
              )}
              <Button importance="secondary" crud="create"
                disabled={!note} title={!note ? `Du skal oprette et notat til ${firstName}, før du må bestille en taxa.` : undefined}
                onClick={() => onModalOpen({
                  modal: () => <CreateBookingModal modalRef={createBookingModalRef} selectedCitizen={citizen} />,
                  modalRef: createBookingModalRef
                })}>Bestil til {firstName}</Button>
            </div>
          </header>
          {latestBooking ?
            <ul className="bookings-list">
              <BookingItem booking={latestBooking} isLatest
                onChangeBooking={() => onModalOpen({
                  modal: () => <EditBookingModal modalRef={editBookingModalRef} selected={latestBooking} selectedCitizen={citizen} />,
                  modalRef: editBookingModalRef
                })}
                onDeleteBooking={() => onModalOpen({
                  modal: () => <DeleteBookingModal modalRef={deleteBookingModalRef} selected={latestBooking} selectedCitizen={citizen} />,
                  modalRef: deleteBookingModalRef
                })}
              />
              {showAllBookings
                && bookings
                && bookings.length > 0
                && bookings.map(bookings => (
                  <ul key={bookings[0].arrival.getDate()}>
                    {bookings.map(booking => (
                      <BookingItem key={booking.id} booking={booking} isLatest={booking.id === latestBooking?.id}
                        onChangeBooking={() => onModalOpen({
                          modal: () => <EditBookingModal modalRef={editBookingModalRef} selected={booking} selectedCitizen={citizen} />,
                          modalRef: editBookingModalRef
                        })}
                        onDeleteBooking={() => onModalOpen({
                          modal: () => <DeleteBookingModal modalRef={deleteBookingModalRef} selected={booking} selectedCitizen={citizen} />,
                          modalRef: deleteBookingModalRef
                        })}
                      />
                    ))}
                  </ul>
                ))
              }
            </ul>
            : <p className="muted">Borgeren har ingen bestillinger.</p>
          }
        </section>
      )}

      {!hideNotes && (
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
                  >Slet {firstName}s notat</Button>
                  <Button type="button" importance="secondary" crud="update" onClick={() => onModalOpen({
                    modal: () => <EditNoteModal modalRef={editNoteModalRef} selected={note} selectedCitizen={citizen} />,
                    modalRef: editNoteModalRef
                  })}>Redigér {firstName}s notat</Button>
                </div>
              </>
            )
            : (
              <>
                <p className="muted">Borgeren har intet notat.</p>
                <div className="button-container">
                  <Button type="button" crud="create" onClick={() => onModalOpen({
                    modal: () => <CreateNoteModal modalRef={createNoteModalRef} selectedCitizen={citizen} />,
                    modalRef: createNoteModalRef
                  })}>Tilføj notat til {firstName}</Button>
                </div>
              </>
            )
          }
        </section>
      )}

      {!hideCitizens && (
        <footer className="button-container">
          <Button type="button" importance="secondary" crud="delete"
            onClick={() => onModalOpen({
              modal: () => <DeleteCitizenModal modalRef={deleteCitizenModalRef} selected={citizen} />,
              modalRef: deleteCitizenModalRef
            })}
          >Slet {firstName}</Button>
          <Button type="button" importance="secondary" crud="update"
            onClick={() => onModalOpen({
              modal: () => <EditCitizenModal modalRef={editCitizenModalRef} selected={citizen} />,
              modalRef: editCitizenModalRef
            })}
          >Redigér {firstName}</Button>
        </footer>
      )}
    </article>
  );
}