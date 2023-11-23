import Modal from "components/shared/Modal";
import { ButtonProps } from "danholibraryrjs";
import { BaseModifyPayload } from "models/backend/business/models/payloads/BaseModifyPayload";
import { Citizen } from "models/backend/common";
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
  onSubmit(model: TPayload): Promise<boolean>;

  selectedCitizen?: Citizen;
}

export type EntityModifyExtendProps<TEntity, TPayload> = Pick<
  Props<TEntity, TPayload>,
  'defaultModel' | 'crud' | 'modalRef' | 'onSubmit' | 'selectedCitizen'
>;

export default function EntityModifyModal<
  TPayload extends BaseModifyPayload<any>,
  TEntity extends BaseEntity
>({ 
  modalRef, 
  crud, entityName,
  children, selectedCitizen,
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
        {crud !== 'create' && <input type="hidden" name="id" value={props.defaultModel?.id} />}
        <input type="hidden" name="citizenId" value={selectedCitizen?.id} />

        {children}
      </form> 
    </Modal>
  );
}