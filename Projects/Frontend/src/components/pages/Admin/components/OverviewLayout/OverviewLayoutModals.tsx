import { RefObject } from 'react';
import { Citizen, Booking } from 'models/backend/common';
import { EntityModalProps } from './OverviewLayout';

type Props = EntityModalProps & {
  selectedCitizen: Citizen | undefined;
  selectedBooking: Booking | undefined;
  mainCreateModalRef: RefObject<HTMLDialogElement>;
}

export default function OverviewLayoutModals({
  selectedBooking, selectedCitizen, 
  mainCreateModalRef, mainCreateModal: MainCreateModal, 

  createCitizenModalRef, editCitizenModalRef, deleteCitizenModalRef,
  CreateCitizenModal, EditCitizenModal, DeleteCitizenModal,

  createBookingModalRef, editBookingModalRef, deleteBookingModalRef,
  CreateBookingModal, EditBookingModal, DeleteBookingModal,

  createNoteModalRef, editNoteModalRef, deleteNoteModalRef,
  CreateNoteModal, EditNoteModal, DeleteNoteModal
}: Props) {

  return (
    <div id="entity-modals">
      <MainCreateModal modalRef={mainCreateModalRef} />

      {/* {CreateCitizenModal && createCitizenModalRef && (
        <CreateCitizenModal modalRef={createCitizenModalRef} />
      )} */}
      {EditCitizenModal && editCitizenModalRef && (
        <EditCitizenModal selected={selectedCitizen} modalRef={editCitizenModalRef} />
      )}
      {DeleteCitizenModal && deleteCitizenModalRef && (
        <DeleteCitizenModal selected={selectedCitizen} modalRef={deleteCitizenModalRef} />
      )}

      {CreateBookingModal && createBookingModalRef && (
        <CreateBookingModal selectedCitizen={selectedCitizen} modalRef={createBookingModalRef} />
      )}
      {EditBookingModal && editBookingModalRef && (
        <EditBookingModal selectedCitizen={selectedCitizen} selected={selectedBooking} modalRef={editBookingModalRef} />
      )}
      {DeleteBookingModal && deleteBookingModalRef && (
        <DeleteBookingModal selectedCitizen={selectedCitizen} selected={selectedBooking} modalRef={deleteBookingModalRef} />
      )}

      {CreateNoteModal && createNoteModalRef && (
        <CreateNoteModal selectedCitizen={selectedCitizen} modalRef={createNoteModalRef} />
      )}
      {EditNoteModal && editNoteModalRef && (
        <EditNoteModal selectedCitizen={selectedCitizen} selected={selectedCitizen?.note ?? undefined} modalRef={editNoteModalRef} />
      )}
      {DeleteNoteModal && deleteNoteModalRef && (
        <DeleteNoteModal selectedCitizen={selectedCitizen} selected={selectedCitizen?.note ?? undefined} modalRef={deleteNoteModalRef} />
      )}
    </div>
  );
}