import Modal from "components/shared/Modal";
import { ButtonProps } from "danholibraryrjs";
import { BaseModifyPayload } from "models/backend/business/models/payloads/BaseModifyPayload";
import { BaseEntity } from "models/backend/common/dtos/BaseEntity";
import { serializeForm } from "utils";

type Props<TEntity, TPayload> = {
  /** The reference to the modal element */
  modalRef: React.RefObject<HTMLDialogElement>;
  children: React.ReactNode;

  crud: ButtonProps['crud']
  entityName: string;

  defaultModel?: TEntity;
  payload: TPayload;
  onSubmit(model: TPayload): void;
}

export type { Props as EntityModifyModalProps };

export default function EntityModifyModal<
  TPayload extends BaseModifyPayload<any>,
  TEntity extends BaseEntity
>({ 
  modalRef, 
  crud, entityName,
  children,
  ...props
}: Props<TEntity, TPayload>) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = serializeForm<TPayload>(e.currentTarget);
    props.onSubmit(data);
  }
  
  return (
    <Modal modalRef={modalRef} className={`${entityName}-${crud}`}>
      <h1>{crud === 'create' ? 'Opret' 
        : crud === 'update' ? 'Opdater' 
        : 'Slet'} {entityName}</h1>
      <form onSubmit={onSubmit}>
        {children}
      </form>
    </Modal>
  );
}