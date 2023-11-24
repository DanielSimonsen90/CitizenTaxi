import { useRef } from "react";

import { CitizenProvider, useCitizen } from "providers/CitizenProvider";
import { Citizen } from "models/backend/common";

import Modal from "components/shared/Modal";
import { DeleteBookingModalContent } from "components/shared/Modal/components";
import { CitizenNoteInputs } from "components/pages/Citizen/components";

import { EntityModalProps, ModifyEntityModal } from "../components/OverviewLayout/OverviewLayout";
import { CitizenModal, NoteModal, DeleteEntityModal, BookingModal } from "../components/EntityModifyModal";
import { useApiActions } from "hooks/useApiActions";

export function useCitizenModals() {
  const citizenProps = useCitizen(false);
  const dispatch = useApiActions({ ...citizenProps, closeModalAutomatically: false })
  const createCitizenModalRef = useRef<HTMLDialogElement>(null);
  const editCitizenModalRef = useRef<HTMLDialogElement>(null);
  const deleteCitizenModalRef = useRef<HTMLDialogElement>(null);

  const CreateCitizenModal: ModifyEntityModal<Citizen> = ({ modalRef }) => (
    <CitizenModal modalRef={modalRef} crud="create"
      onSubmit={payload => dispatch('createCitizen', payload)}
    />
  );
  const EditCitizenModal: ModifyEntityModal<Citizen> = ({ modalRef, selected }) => (
    <CitizenModal modalRef={modalRef} crud="update"
      onSubmit={payload => dispatch('updateCitizen', payload as any)} defaultModel={selected}
      onNoteSubmit={payload => dispatch('createNote', payload)}
    />
  );

  const DeleteCitizenModal: ModifyEntityModal<Citizen> = ({ modalRef, selected }) => (
    <DeleteEntityModal modalRef={modalRef} title={selected?.name || "Borgeren"}
      entityId={selected?.id || ""} action="deleteCitizen"
      // TODO: Preview
      preview={() => <p>This is test preview</p>}
    />
  );

  return {
    createCitizenModalRef, editCitizenModalRef, deleteCitizenModalRef,
    CreateCitizenModal, EditCitizenModal, DeleteCitizenModal
  };
}

export function useBookingModals() {
  const citizenProps = useCitizen(false);
  const dispatch = useApiActions(citizenProps);
  const createBookingModalRef = useRef<HTMLDialogElement>(null);
  const editBookingModalRef = useRef<HTMLDialogElement>(null);
  const deleteBookingModalRef = useRef<HTMLDialogElement>(null);

  const CreateBookingModal: EntityModalProps['CreateBookingModal'] = (props) =>
    <BookingModal crud="create" onSubmit={payload => dispatch('createBooking', payload)} {...props} />;
  const EditBookingModal: EntityModalProps['EditBookingModal'] = ({ selected, ...props }) =>
    <BookingModal crud="update" onSubmit={payload => dispatch('updateBooking', payload)} defaultModel={selected} {...props} />;
  const DeleteBookingModal: EntityModalProps['DeleteBookingModal'] = ({ selected, selectedCitizen, modalRef }) =>
    <Modal modalRef={modalRef}>
      <DeleteBookingModalContent booking={selected!} citizen={selectedCitizen} 
        onCancel={() => modalRef.current?.close()}
        onConfirm={async () => {
          const closeModal = await dispatch('deleteBooking', selected?.id!);
          closeModal();
        }}
      />
    </Modal>

  return {
    createBookingModalRef, editBookingModalRef, deleteBookingModalRef,
    CreateBookingModal, EditBookingModal, DeleteBookingModal
  };
}

export function useNoteModals() {
  const citizenProps = useCitizen(false);
  const dispatch = useApiActions(citizenProps);

  const createNoteModalRef = useRef<HTMLDialogElement>(null);
  const editNoteModalRef = useRef<HTMLDialogElement>(null);
  const deleteNoteModalRef = useRef<HTMLDialogElement>(null);

  const CreateNoteModal: EntityModalProps['CreateNoteModal'] = (props) =>
    <NoteModal crud="create" onSubmit={payload => dispatch('createNote', payload)} {...props} />;
  const EditNoteModal: EntityModalProps['EditNoteModal'] = ({ selected, ...props }) =>
    <NoteModal crud="update" onSubmit={payload => dispatch('updateNote', payload)} defaultModel={selected} {...props} />;
  const DeleteNoteModal: EntityModalProps['DeleteNoteModal'] = ({ selected, ...props }) =>
    <DeleteEntityModal title="Notat" entityId={selected?.id || ""} action="deleteNote" {...props}
      preview={() => (
        <CitizenProvider citizen={props.selectedCitizen}>
          <CitizenNoteInputs />
        </CitizenProvider>
      )}
    />;

  return {
    createNoteModalRef, editNoteModalRef, deleteNoteModalRef,
    CreateNoteModal, EditNoteModal, DeleteNoteModal
  };
}