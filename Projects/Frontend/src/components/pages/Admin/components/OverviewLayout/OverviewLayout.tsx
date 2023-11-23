import { Button, FunctionComponent } from "danholibraryrjs";
import { Link } from "react-router-dom";

import { CitizenProvider } from "providers/CitizenProvider";
import { Booking, Citizen, Note } from "models/backend/common";

import { CitizenCard } from "../CitizenCard";
import { MutableRefObject, RefObject, useMemo, useRef, useState } from "react";
import { ModalProps } from "components/shared/Modal/Modal";
import OverviewLayoutModals from "./OverviewLayoutModals";

export type ModifyCitizenModal<P = {}> = FunctionComponent<Pick<ModalProps, 'modalRef'> & { selectedCitizen?: Citizen; } & P>;
export type EntityModalProps = {
  createCitizenModalRef?: RefObject<HTMLDialogElement>;
  CreateCitizenModal: FunctionComponent<Pick<ModalProps, 'modalRef'>>;
  editCitizenModalRef?: RefObject<HTMLDialogElement>;
  EditCitizenModal?: ModifyCitizenModal;
  deleteCitizenModalRef?: RefObject<HTMLDialogElement>;
  DeleteCitizenModal?: ModifyCitizenModal;

  createBookingModalRef?: RefObject<HTMLDialogElement>;
  CreateBookingModal: ModifyCitizenModal;
  editBookingModalRef?: RefObject<HTMLDialogElement>;
  EditBookingModal?: ModifyCitizenModal<{ booking?: Booking; }>;
  deleteBookingModalRef?: RefObject<HTMLDialogElement>;
  DeleteBookingModal?: ModifyCitizenModal<{ booking?: Booking; }>;

  createNoteModalRef?: RefObject<HTMLDialogElement>;
  CreateNoteModal: ModifyCitizenModal;
  editNoteModalRef?: RefObject<HTMLDialogElement>;
  EditNoteModal?: ModifyCitizenModal<{ note?: Note; }>;
  deleteNoteModalRef?: RefObject<HTMLDialogElement>;
  DeleteNoteModal?: ModifyCitizenModal<{ note?: Note; }>;
}

type Props = EntityModalProps & {
  pageTitle: string;
  entity: string;
  citizens: Array<Citizen>;

  onViewAllBookings: (citizen: Citizen) => void;
};

export default function OverviewLayout({
  pageTitle, entity, citizens,
  onViewAllBookings,
  ...modalProps
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

      <OverviewLayoutModals {...{ selectedBooking, selectedCitizen, ...modalProps }} />

      <section className="citizen-list" role="list">
        {citizens.map(citizen => (
          <CitizenProvider key={citizen.id} citizen={citizen}>
            <CitizenCard citizen={citizen}
              onCreateBooking={() => {
                setSelectedBooking(undefined);
                modalProps.createBookingModalRef?.current?.showModal();
              }}
              onCreateNote={() => {
                modalProps.createNoteModalRef?.current?.showModal();
              }}

              onEditBooking={booking => {
                setSelectedCitizen(citizen);
                setSelectedBooking(booking);
                modalProps.editBookingModalRef?.current?.showModal();
              }}
              onEditNote={() => {
                setSelectedCitizen(citizen);
                modalProps.editNoteModalRef?.current?.showModal();
              }}

              onDeleteBooking={booking => {
                setSelectedCitizen(citizen);
                setSelectedBooking(booking);
                modalProps.deleteBookingModalRef?.current?.showModal();
              }}
              onDeleteNote={() => {
                setSelectedCitizen(citizen);
                modalProps.deleteNoteModalRef?.current?.showModal();
              }}

              onViewAllBookings={() => onViewAllBookings(citizen)}
            />
          </CitizenProvider>
        ))}
      </section>
    </main>
  );
}