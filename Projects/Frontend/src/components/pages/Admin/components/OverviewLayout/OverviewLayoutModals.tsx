import { Citizen, Booking } from 'models/backend/common';
import { EntityModalProps } from './OverviewLayout';

type Props = EntityModalProps & {
  selectedCitizen: Citizen | undefined;
  selectedBooking: Booking | undefined;
}

export default function OverviewLayoutModals({
  selectedBooking, selectedCitizen,

  createCitizenModalRef, editCitizenModalRef, deleteCitizenModalRef,
  CreateCitizenModal, EditCitizenModal, DeleteCitizenModal,

  createBookingModalRef, editBookingModalRef, deleteBookingModalRef,
  CreateBookingModal, EditBookingModal, DeleteBookingModal,

  createNoteModalRef, editNoteModalRef, deleteNoteModalRef,
  CreateNoteModal, EditNoteModal, DeleteNoteModal
}: Props) {

  return (
    <>
      {CreateCitizenModal && createCitizenModalRef && (
        <CreateCitizenModal modalRef={createCitizenModalRef} />
      )}
      {EditCitizenModal && editCitizenModalRef && (
        <EditCitizenModal selectedCitizen={selectedCitizen} modalRef={editCitizenModalRef} />
      )}
      {DeleteCitizenModal && deleteCitizenModalRef && (
        <DeleteCitizenModal selectedCitizen={selectedCitizen} modalRef={deleteCitizenModalRef} />
      )}

      {CreateBookingModal && createBookingModalRef && (
        <CreateBookingModal selectedCitizen={selectedCitizen} modalRef={createBookingModalRef} />
      )}
      {EditBookingModal && editBookingModalRef && (
        <EditBookingModal selectedCitizen={selectedCitizen} booking={selectedBooking} modalRef={editBookingModalRef} />
      )}
      {DeleteBookingModal && deleteBookingModalRef && (
        <DeleteBookingModal selectedCitizen={selectedCitizen} booking={selectedBooking} modalRef={deleteBookingModalRef} />
      )}

      {CreateNoteModal && createNoteModalRef && (
        <CreateNoteModal selectedCitizen={selectedCitizen} modalRef={createNoteModalRef} />
      )}
      {EditNoteModal && editNoteModalRef && (
        <EditNoteModal selectedCitizen={selectedCitizen} modalRef={editNoteModalRef} />
      )}
      {DeleteNoteModal && deleteNoteModalRef && (
        <DeleteNoteModal selectedCitizen={selectedCitizen} modalRef={deleteNoteModalRef} />
      )}
    </>
  );
}