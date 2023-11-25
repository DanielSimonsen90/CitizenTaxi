import { FormEvent, RefObject } from "react";
import { Button, FunctionComponent } from "danholibraryrjs";

import Modal from "components/shared/Modal";

type Props = {
  modalRef: RefObject<HTMLDialogElement>;
  title: string;
  preview: FunctionComponent;
  onSubmit: () => void;
};

export default function EntityDeleteModal({
  modalRef,
  title, preview: Preview,
  ...props
}: Props) {
 
  const onSubmit =  (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onSubmit();
  };

  return (
    <Modal className="entity-delete-modal" modalRef={modalRef}>
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