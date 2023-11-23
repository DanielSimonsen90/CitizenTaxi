import { useRef } from "react";
import { ModifyCitizenModal } from "../components/OverviewLayout/OverviewLayout";
import { CitizenModal } from "../components/EntityModifyModal";
import { BookingModifyPayload, UserModifyPayload, BaseModifyPayload } from "models/backend/business/models/payloads";
import EntityDeleteModal from "../components/EntityModifyModal/Modals/EntityDeleteModal";

type UseEntityModalsProps<TPayload extends BaseModifyPayload<true>> = {
  onCreateSubmit(payload: TPayload): void;
  onEditSubmit(payload: TPayload): void;
};

export function useCitizenModals({ onCreateSubmit, onEditSubmit }: UseEntityModalsProps<UserModifyPayload<true>>) {
  const createCitizenModalRef = useRef<HTMLDialogElement>(null);
  const editCitizenModalRef = useRef<HTMLDialogElement>(null);
  const deleteCitizenModalRef = useRef<HTMLDialogElement>(null);

  const CreateCitizenModal = () => (
    <CitizenModal modalRef={createCitizenModalRef} crud="create"
      onSubmit={onCreateSubmit}
    />
  );
  const EditCitizenModal: ModifyCitizenModal = ({ modalRef, selectedCitizen }) => (
    <CitizenModal modalRef={modalRef} crud="update"
      onSubmit={onEditSubmit} defaultModel={selectedCitizen}
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

export function useBookingModals({ onCreateSubmit, onEditSubmit }: UseEntityModalsProps<BookingModifyPayload<true>>) {
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

export function useNoteModals({ onCreateSubmit, onEditSubmit }: UseEntityModalsProps<BookingModifyPayload<true>>) {
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