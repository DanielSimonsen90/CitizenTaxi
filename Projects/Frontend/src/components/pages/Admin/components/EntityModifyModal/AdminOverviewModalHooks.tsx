import { Dispatch, SetStateAction, useRef } from "react";

import { CitizenProvider, useCitizen } from "providers/CitizenProvider";
import { Citizen } from "models/backend/common";

import Modal from "components/shared/Modal";
import { DeleteBookingModalContent } from "components/shared/Modal/components";
import { CitizenNoteInputs } from "components/pages/Citizen/components";
import { useApiActions } from "hooks";

import { EntityModalProps, ModifyEntityModal } from "../OverviewLayout/OverviewLayout";
import { CitizenModal, NoteModal, DeleteEntityModal, BookingModal } from ".";
import { CitizenCard } from "../CitizenCard";

type CitizenModalProps = {
  setCitizens: Dispatch<SetStateAction<Array<Citizen>>>;
};

export function useCitizenModals({ setCitizens }: CitizenModalProps) {
  const { setCitizen } = useCitizen(false);
  const dispatch = useApiActions({
    setCitizen, setCitizens,
  });
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
    />
  );

  const DeleteCitizenModal: ModifyEntityModal<Citizen> = ({ modalRef, selected }) => (
    <DeleteEntityModal modalRef={modalRef} title={selected?.name || "Borgeren"}
      onSubmit={async () => {
        await dispatch('deleteCitizen', selected?.id!);
      }}
      preview={() => (
        <CitizenProvider citizen={selected}>
          <CitizenCard
            onModalOpen={() => { }} setCitizens={() => { }}
          />
        </CitizenProvider>
      )}
    />
  );

  return {
    createCitizenModalRef, editCitizenModalRef, deleteCitizenModalRef,
    CreateCitizenModal, EditCitizenModal, DeleteCitizenModal
  };
}

export function useBookingModals(citizens?: Array<Citizen>) {
  const { setCitizen } = useCitizen(false);
  const dispatch = useApiActions({ setCitizen });
  const createBookingModalRef = useRef<HTMLDialogElement>(null);
  const editBookingModalRef = useRef<HTMLDialogElement>(null);
  const deleteBookingModalRef = useRef<HTMLDialogElement>(null);

  const CreateBookingModal: EntityModalProps['CreateBookingModal'] = (props) =>
    <BookingModal crud="create" onSubmit={payload => dispatch('createBooking', payload)} {...props} citizens={citizens} />;
  const EditBookingModal: EntityModalProps['EditBookingModal'] = ({ selected, ...props }) =>
    <BookingModal crud="update" onSubmit={payload => dispatch('updateBooking', payload)} defaultModel={selected} {...props} />;
  const DeleteBookingModal: EntityModalProps['DeleteBookingModal'] = ({ selected, selectedCitizen, modalRef }) =>
    <Modal modalRef={modalRef}>
      <DeleteBookingModalContent booking={selected!} citizen={selectedCitizen}
        onCancel={() => modalRef.current?.close()}
        onConfirm={() => dispatch('deleteBooking', selected?.id!)}
      />
    </Modal>;

  return {
    createBookingModalRef, editBookingModalRef, deleteBookingModalRef,
    CreateBookingModal, EditBookingModal, DeleteBookingModal
  };
}

export function useNoteModals(citizens?: Array<Citizen>) {
  const { setCitizen } = useCitizen(false);
  const dispatch = useApiActions({ setCitizen });

  const createNoteModalRef = useRef<HTMLDialogElement>(null);
  const editNoteModalRef = useRef<HTMLDialogElement>(null);
  const deleteNoteModalRef = useRef<HTMLDialogElement>(null);

  const CreateNoteModal: EntityModalProps['CreateNoteModal'] = (props) =>
    <NoteModal crud="create" onSubmit={payload => dispatch('createNote', payload)} {...props} citizens={citizens} />;
  const EditNoteModal: EntityModalProps['EditNoteModal'] = ({ selected, ...props }) =>
    <NoteModal crud="update" onSubmit={payload => dispatch('updateNote', payload)} defaultModel={selected} {...props} />;
  const DeleteNoteModal: EntityModalProps['DeleteNoteModal'] = ({ selected, ...props }) =>
    <DeleteEntityModal onSubmit={() => dispatch('deleteNote', selected?.id!)} title="Notat" {...props}
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