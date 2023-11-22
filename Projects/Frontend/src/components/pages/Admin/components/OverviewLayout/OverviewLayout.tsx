import { Button, FunctionComponent } from "danholibraryrjs";
import { Link } from "react-router-dom";

import { CitizenProvider } from "providers/CitizenProvider";
import { Booking, Citizen, Note } from "models/backend/common";

import { CitizenCard } from "../CitizenCard";
import { MutableRefObject, RefObject, useMemo, useRef, useState } from "react";
import { ModalProps } from "components/shared/Modal/Modal";

export type ModifyCitizenModal<P = {}> = FunctionComponent<Pick<ModalProps, 'modalRef'> & { selectedCitizen?: Citizen; } & P>;

type Props = {
  pageTitle: string;
  entity: string;
  citizens: Array<Citizen>;

  onViewAllBookings: (citizen: Citizen) => void;

  CreateModal: FunctionComponent<Pick<ModalProps, 'modalRef'>>;

  editCitizenModalRef?: RefObject<HTMLDialogElement>;
  EditCitizenModal?: ModifyCitizenModal;

  deleteCitizenModalRef?: RefObject<HTMLDialogElement>;
  DeleteCitizenModal?: ModifyCitizenModal;

  editBookingModalRef?: RefObject<HTMLDialogElement>;
  EditBookingModal?: ModifyCitizenModal<{ booking?: Booking; }>;

  deleteBookingModalRef?: RefObject<HTMLDialogElement>;
  DeleteBookingModal?: ModifyCitizenModal<{ booking?: Booking; }>;

  editNoteModalRef?: RefObject<HTMLDialogElement>;
  EditNoteModal?: ModifyCitizenModal<{ note?: Note; }>;

  deleteNoteModalRef?: RefObject<HTMLDialogElement>;
  DeleteNoteModal?: ModifyCitizenModal<{ note?: Note; }>;
};

export default function OverviewLayout({
  pageTitle, entity, citizens,
  onViewAllBookings, CreateModal,

  editCitizenModalRef, deleteCitizenModalRef,
  EditCitizenModal, DeleteCitizenModal,
  
  editBookingModalRef, deleteBookingModalRef,
  EditBookingModal, DeleteBookingModal,
  
  editNoteModalRef, deleteNoteModalRef,
  EditNoteModal, DeleteNoteModal
}: Props) {
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen>();
  const [selectedBooking, setSelectedBooking] = useState<Booking>();
  const createModalRef = useRef<HTMLDialogElement>(null);
  
  return (
    <main className="admin-overview">
      <header>
        <Link to='/' className="button secondary alt">Tilbage til oversigt</Link>
        <h1>{pageTitle}</h1>
        <Button type="button" importance="primary" className="alt"
          onClick={() => createModalRef.current?.showModal()}
        >Opret {entity}</Button>
      </header>

      <CreateModal modalRef={createModalRef} />
      {EditCitizenModal && editCitizenModalRef && (
        <EditCitizenModal selectedCitizen={selectedCitizen} modalRef={editCitizenModalRef} />
      )}
      {DeleteCitizenModal && deleteCitizenModalRef && (
        <DeleteCitizenModal selectedCitizen={selectedCitizen} modalRef={deleteCitizenModalRef} />
      )}
      {EditBookingModal && editBookingModalRef && (
        <EditBookingModal selectedCitizen={selectedCitizen} booking={selectedBooking} modalRef={editBookingModalRef} />
      )}
      {DeleteBookingModal && deleteBookingModalRef && (
        <DeleteBookingModal selectedCitizen={selectedCitizen} booking={selectedBooking} modalRef={deleteBookingModalRef} />
      )}
      {EditNoteModal && editNoteModalRef && (
        <EditNoteModal selectedCitizen={selectedCitizen} modalRef={editNoteModalRef} />
      )}
      {DeleteNoteModal && deleteNoteModalRef && (
        <DeleteNoteModal selectedCitizen={selectedCitizen} modalRef={deleteNoteModalRef} />
      )}

      <section className="citizen-list" role="list">
        {citizens.map(citizen => (
          <CitizenProvider key={citizen.id} citizen={citizen}>
            <CitizenCard citizen={citizen}
              onChangeBooking={booking => {
                setSelectedCitizen(citizen);
                setSelectedBooking(booking);
                editBookingModalRef?.current?.showModal();
              }}
              onChangeNote={() => {
                setSelectedCitizen(citizen);
                editNoteModalRef?.current?.showModal();
              }}
              onDeleteBooking={booking => {
                setSelectedCitizen(citizen);
                setSelectedBooking(booking);
                deleteBookingModalRef?.current?.showModal();
              }}
              onDeleteNote={() => {
                setSelectedCitizen(citizen);
                deleteNoteModalRef?.current?.showModal();
              }}
              onViewAllBookings={() => onViewAllBookings(citizen)}
            />
          </CitizenProvider>
        ))}
      </section>
    </main>
  );
}