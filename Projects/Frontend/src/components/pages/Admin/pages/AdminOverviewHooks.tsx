import { useRef } from "react";

import { useNotification } from "providers/NotificationProvider";

import { EntityModalProps, ModifyEntityModal } from "../components/OverviewLayout/OverviewLayout";
import { CitizenModal, NoteModal, DeleteEntityModal } from "../components/EntityModifyModal";
import { getBookingSubmits, getCitizenSubmits, getNoteSubmits } from "./AdminCitizenOverview/AdminCitizenOverviewConstants";
import { Citizen, Note } from "models/backend/common";
import { CitizenNoteInputs } from "components/pages/Citizen/components";
import { CitizenProvider } from "providers/CitizenProvider";

export function useCitizenModals() {
  const { setNotification } = useNotification();
  const { onCreateCitizenSubmit, onEditCitizenSubmit } = getCitizenSubmits(setNotification);
  const { onCreateNoteSubmit } = getNoteSubmits(setNotification);
  const createCitizenModalRef = useRef<HTMLDialogElement>(null);
  const editCitizenModalRef = useRef<HTMLDialogElement>(null);
  const deleteCitizenModalRef = useRef<HTMLDialogElement>(null);

  const CreateCitizenModal: ModifyEntityModal<Citizen> = ({ modalRef }) => (
    <CitizenModal modalRef={modalRef} crud="create"
      onSubmit={onCreateCitizenSubmit}
    />
  );
  const EditCitizenModal: ModifyEntityModal<Citizen> = ({ modalRef, selected }) => (
    <CitizenModal modalRef={modalRef} crud="update"
      onSubmit={onEditCitizenSubmit} defaultModel={selected}
      onNoteSubmit={onCreateNoteSubmit}
    />
  );

  const DeleteCitizenModal: ModifyEntityModal<Citizen> = ({ modalRef, selected }) => (
    <DeleteEntityModal modalRef={modalRef} title={selected?.name || "Borgeren"}
      endpoint="users" entityId={selected?.id || ""}
      preview={() => <p>This is test preview</p>}
    />
  );

  return {
    createCitizenModalRef, editCitizenModalRef, deleteCitizenModalRef,
    CreateCitizenModal, EditCitizenModal, DeleteCitizenModal
  };
}

export function useBookingModals() {
  const { setNotification } = useNotification();
  const { onCreateBookingSubmit, onEditBookingSubmit } = getBookingSubmits(setNotification);

  const createBookingModalRef = useRef<HTMLDialogElement>(null);
  const editBookingModalRef = useRef<HTMLDialogElement>(null);
  const deleteBookingModalRef = useRef<HTMLDialogElement>(null);

  const CreateBookingModal = () => <></>;
  const EditBookingModal = () => <></>;
  const DeleteBookingModal = () => <></>;

  return {
    createBookingModalRef, editBookingModalRef, deleteBookingModalRef,
    CreateBookingModal, EditBookingModal, DeleteBookingModal
  };
}

export function useNoteModals() {
  const { setNotification } = useNotification();
  const { onCreateNoteSubmit, onEditNoteSubmit } = getNoteSubmits(setNotification);

  const createNoteModalRef = useRef<HTMLDialogElement>(null);
  const editNoteModalRef = useRef<HTMLDialogElement>(null);
  const deleteNoteModalRef = useRef<HTMLDialogElement>(null);

  const CreateNoteModal: EntityModalProps['CreateNoteModal'] = (props) =>
    <NoteModal crud="create" onSubmit={onCreateNoteSubmit} {...props} />;
  const EditNoteModal: EntityModalProps['EditNoteModal'] = ({ selected, ...props }) =>
    <NoteModal crud="update" onSubmit={onEditNoteSubmit} defaultModel={selected} {...props} />;
  const DeleteNoteModal: EntityModalProps['DeleteNoteModal'] = ({ selected, ...props }) =>
    <DeleteEntityModal title="Notat" endpoint="notes" entityId={selected?.id || ""} {...props}
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