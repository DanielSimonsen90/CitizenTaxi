import { RefObject } from "react";
import { Button, FunctionComponent } from "danholibraryrjs";

import Modal from "components/shared/Modal";
import { useNotification } from "providers/NotificationProvider";
import { Guid } from "types";
import { ApiEndpoints, Request } from "utils";

type Props = {
  modalRef: RefObject<HTMLDialogElement>;
  title: string;
  endpoint: ApiEndpoints;
  entityId: Guid;
  preview: FunctionComponent;
};

type onDeleteEntitySubmitProps = Pick<Props, 'modalRef' | 'endpoint' | 'entityId' | 'title'> & {
  setNotification: ReturnType<typeof useNotification>['setNotification'];
};

export const onDeleteEntitySubmit = ({
  modalRef, endpoint, entityId,
  title, setNotification
}: onDeleteEntitySubmitProps) => async (e: Pick<React.FormEvent<HTMLFormElement>, 'preventDefault'>) => {
  e.preventDefault();
  try {
    const response = await Request(`${endpoint}/${entityId}`, {
      method: 'DELETE'
    });
  
    modalRef.current?.close();
    if (response.success) setNotification({ type: "success", message: `${title.toPascalCase()} slettet.` });
    else setNotification({ type: "error", message: response.text });
  } catch (error) {
    setNotification({ type: "error", message: (error as Error).message });
  }
};

export default function EntityDeleteModal({
  modalRef,
  title, preview: Preview,
  endpoint, entityId
}: Props) {
  const { setNotification } = useNotification();

  return (
    <Modal className="entity-delete-modal" modalRef={modalRef} data-entity-id={entityId || undefined}>
      <form onSubmit={onDeleteEntitySubmit({ endpoint, entityId, modalRef, setNotification, title })}>
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