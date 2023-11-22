import { useRef } from "react";
import { ModifyCitizenModal } from "../../components/OverviewLayout/OverviewLayout";
import { CitizenModal } from "../../components/EntityModifyModal";
import { BookingModifyPayload, UserModifyPayload, BaseModifyPayload } from "models/backend/business/models/payloads";

type UseEntityModalsProps<TPayload extends BaseModifyPayload<true>> = {
  onEditSubmit(payload: TPayload): void;
};

export function useCitizenModals({ onEditSubmit: onEditCitizenSubmit }: UseEntityModalsProps<UserModifyPayload<true>>) {
  const editCitizenModalRef = useRef<HTMLDialogElement>(null);
  const deleteCitizenModalRef = useRef<HTMLDialogElement>(null);

  const EditCitizenModal: ModifyCitizenModal = ({ modalRef, selectedCitizen }) => (
    <CitizenModal modalRef={modalRef} crud="update"
      onSubmit={onEditCitizenSubmit} defaultModel={selectedCitizen}
    />
  );

  const DeleteCitizenModal = () => <></>;

  return {
    editCitizenModalRef, deleteCitizenModalRef,
    EditCitizenModal, DeleteCitizenModal
  }
}

export function useBookingModals({ onEditSubmit } : UseEntityModalsProps<BookingModifyPayload<true>>) {
  const editBookingModalRef = useRef<HTMLDialogElement>(null);
  const deleteBookingModalRef = useRef<HTMLDialogElement>(null);

  const EditBookingModal = () => <></>;
  const DeleteBookingModal = () => <></>;

  return {
    editBookingModalRef, deleteBookingModalRef,
    EditBookingModal, DeleteBookingModal
  }
}

export function useNoteModals({ onEditSubmit } : UseEntityModalsProps<BookingModifyPayload<true>>) {
  const editNoteModalRef = useRef<HTMLDialogElement>(null);
  const deleteNoteModalRef = useRef<HTMLDialogElement>(null);

  const EditNoteModal = () => <></>;
  const DeleteNoteModal = () => <></>;

  return {
    editNoteModalRef, deleteNoteModalRef,
    EditNoteModal, DeleteNoteModal
  }
}