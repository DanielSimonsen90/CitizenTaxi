import { FormEvent, RefObject } from "react";
import { Button, FunctionComponent } from "danholibraryrjs";

import Modal from "components/shared/Modal";
import { Guid } from "types";
import { useCitizen } from "providers/CitizenProvider";
import { useApiActions } from "hooks/useApiActions";
import { ActionNames } from "utils";

type DeleteActions = Extract<ActionNames, 'deleteBooking' | 'deleteCitizen' | 'deleteNote'>;

type Props<Action extends DeleteActions> = {
  modalRef: RefObject<HTMLDialogElement>;
  title: string;
  entityId: Guid;
  action: Action;
  preview: FunctionComponent;
};

export default function EntityDeleteModal<Action extends DeleteActions>({
  modalRef,
  title, preview: Preview,
  action, entityId
}: Props<Action>) {
  const citizenProps = useCitizen(false);
  const dispatch = useApiActions(citizenProps);
 
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const closeModal = await dispatch(action, entityId);
    closeModal();
  };

  return (
    <Modal className="entity-delete-modal" modalRef={modalRef} data-entity-id={entityId || undefined}>
      <form onSubmit={onSubmit}>
        <header>
          <h1>Du er ved at slette {title}</h1>
          <p>Er du sikker på denne handling?</p>
          <p><strong>Bemærk:</strong> Denne handling kan ikke fortrydes.</p>
        </header>

        <section className="delete-preview">
          <Preview />
        </section>

        <footer className="button-container">
          <Button type="button" importance="tertiary" className="alt"
            onClick={() => modalRef.current?.close()}>
            Fortryd
          </Button>

          <Button type="submit" importance="secondary" crud="delete">
            Slet {title}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}