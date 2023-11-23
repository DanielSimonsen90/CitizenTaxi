import { RefObject, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, FunctionComponent } from "danholibraryrjs";

import { ModalProps } from "components/shared/Modal/Modal";
import { Booking, Citizen, Note } from "models/backend/common";
import { BaseEntity } from "models/backend/common/dtos/BaseEntity";
import { CitizenProvider } from "providers/CitizenProvider";

import { CitizenCard } from "../CitizenCard";
import OverviewLayoutModals from "./OverviewLayoutModals";

export type ModifyCitizenModal<P = {}> = FunctionComponent<Pick<ModalProps, 'modalRef'> & { selectedCitizen?: Citizen; } & P>;
type ModifyEntityModalProps<TEntityName extends string, TEntity extends BaseEntity> = (
  & Record<
    `${'create' | 'edit' | 'delete'}${TEntityName}ModalRef`, 
    RefObject<HTMLDialogElement>>
  & Record<
    `Create${TEntityName}Modal`, 
    FunctionComponent<Pick<ModalProps, 'modalRef'>>>
  & Record<
    `${'Create' | 'Edit' | 'Delete'}${TEntityName}Modal`, 
    ModifyCitizenModal<Partial<Record<Lowercase<TEntityName>, TEntity>>>
  >
)
export type EntityModalProps = Partial<(
  & ModifyEntityModalProps<'Citizen', Citizen>
  & ModifyEntityModalProps<'Booking', Booking>
  & ModifyEntityModalProps<'Note', Note>
)>

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

              onEditCitizen={citizen => {
                setSelectedCitizen(citizen);
                modalProps.editCitizenModalRef?.current?.showModal();
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

              onDeleteCitizen={citizen => {
                setSelectedCitizen(citizen);
                modalProps.deleteCitizenModalRef?.current?.showModal();
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