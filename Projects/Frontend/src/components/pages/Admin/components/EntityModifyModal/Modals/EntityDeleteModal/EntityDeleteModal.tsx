import Modal from "components/shared/Modal";
import { Button, FunctionComponent } from "danholibraryrjs";
import { useNotification } from "providers/NotificationProvider";
import { RefObject } from "react";
import { Guid } from "types";
import { ApiEndpoints, Request } from "utils";

type Props = {
  modalRef: RefObject<HTMLDialogElement>;
  title: string;
  endpoint: ApiEndpoints;
  entityId: Guid;
  preview: FunctionComponent;
};

export default function EntityDeleteModal({ 
  modalRef,
  title, preview: Preview, 
  endpoint, entityId 
}: Props) {
  const { setNotification } = useNotification();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await Request(`${endpoint}/${entityId}`, {
      method: 'DELETE'
    });

    modalRef.current?.close();
    if (response.data) setNotification({ type: "success", message: `${title.toPascalCase()} slettet.` });
    else setNotification({ type: "error", message: response.text });
  }

  return (
    <Modal className="entity-delete-modal" modalRef={modalRef} data-entity-id={entityId}>
      <form onSubmit={onSubmit}>
        <header>
          <h1>Du er ved at slette {title}</h1>
          <p>Er du sikker på denne handling?</p>
          <p className="muted">
            <strong>Bemærk:</strong> Denne handling kan ikke fortrydes.
          </p>
        </header>

        <section className="delete-preview">
          <Preview />
        </section>

        <footer className="button-container">
          <Button type="button" importance="secondary" className="alt" 
            onClick={() => modalRef.current?.close()}>
            Fortryd
          </Button>

          <Button type="submit" importance="primary" crud="delete">
            Slet {title}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}