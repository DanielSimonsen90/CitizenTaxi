import { useRef } from "react";

import { useNotification } from "providers/NotificationProvider";

import { ModifyCitizenModal } from "../components/OverviewLayout/OverviewLayout";
import { CitizenModal } from "../components/EntityModifyModal";
import EntityDeleteModal from "../components/EntityModifyModal/Modals/EntityDeleteModal";
import { getBookingSubmits, getCitizenSubmits, getNoteSubmits } from "./AdminCitizenOverview/AdminCitizenOverviewConstants";

export function useCitizenModals() {
  const { setNotification } = useNotification();
  const { onCreateCitizenSubmit, onEditCitizenSubmit } = getCitizenSubmits(setNotification);
  const createCitizenModalRef = useRef<HTMLDialogElement>(null);
  const editCitizenModalRef = useRef<HTMLDialogElement>(null);
  const deleteCitizenModalRef = useRef<HTMLDialogElement>(null);

  const CreateCitizenModal = () => (
    <CitizenModal modalRef={createCitizenModalRef} crud="create"
      onSubmit={onCreateCitizenSubmit}
    />
  );
  const EditCitizenModal: ModifyCitizenModal = ({ modalRef, selectedCitizen }) => (
    <CitizenModal modalRef={modalRef} crud="update"
      onSubmit={onEditCitizenSubmit} defaultModel={selectedCitizen}
    />
  );

  const DeleteCitizenModal: ModifyCitizenModal = ({ modalRef, selectedCitizen }) => (
    <EntityDeleteModal modalRef={modalRef} title={selectedCitizen?.name || "Borgeren"}
      endpoint="users" entityId={selectedCitizen?.id || ""}
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

  const CreateNoteModal = () => <></>;
  const EditNoteModal = () => <></>;
  const DeleteNoteModal = () => <></>;

  return {
    createNoteModalRef, editNoteModalRef, deleteNoteModalRef,
    CreateNoteModal, EditNoteModal, DeleteNoteModal
  };
}