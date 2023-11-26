import FormGroup from "components/shared/FormGroup";
import Modal from "components/shared/Modal";
import { ButtonProps } from "danholibraryrjs";
import { BaseModifyPayload } from "models/backend/business/models/payloads/BaseModifyPayload";
import { Citizen } from "models/backend/common";
import { BaseEntity } from "models/backend/common/dtos/BaseEntity";
import { serializeForm } from "utils";

export const CITIZEN_ENTITY_NAME = 'borger';
export const NOTE_ENTITY_NAME = 'notat';
export const BOOKING_ENTITY_NAME = 'taxabestilling';

type Props<TEntity, TPayload> = {
  /** The reference to the modal element */
  modalRef: React.RefObject<HTMLDialogElement>;
  children: React.ReactNode;

  crud: ButtonProps['crud']
  entityName: string;

  defaultModel?: TEntity;
  payload: TPayload;
  onSubmit(model: TPayload): Promise<TEntity>;

  selectedCitizen?: Citizen;
  citizens?: Array<Citizen>;
}

export type EntityModifyExtendProps<TEntity, TPayload> = Pick<
  Props<TEntity, TPayload>,
  'defaultModel' | 'crud' | 'modalRef' | 'onSubmit' | 'selectedCitizen' | 'citizens'
>;

export default function EntityModifyModal<
  TPayload extends BaseModifyPayload<any>,
  TEntity extends BaseEntity
>({ 
  modalRef, 
  crud, entityName,
  citizens, children, selectedCitizen,
  ...props
}: Props<TEntity, TPayload>) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = serializeForm<TPayload>(e.currentTarget);
    return props.onSubmit(data);
  }
  
  return (
    <Modal modalRef={modalRef} className={`${entityName}-${crud}`}>
      <h1>{crud === 'create' ? 'Opret' 
        : crud === 'update' ? 'Opdater' 
        : 'Slet'} {entityName}</h1>
      <form onSubmit={onSubmit}>
        {crud !== 'create' && <input type="hidden" name="id" value={props.defaultModel?.id} />}
        {!citizens && <input type="hidden" name="citizenId" value={selectedCitizen?.id} />}
        {citizens && (
          <FormGroup label="Borger" htmlFor={`${crud}-${entityName}-citizenId`}>
            <select id={`${crud}-${entityName}-citizenId`} name="citizenId" defaultValue={selectedCitizen?.id}>
              {citizens
                .filter(c => 
                  entityName === NOTE_ENTITY_NAME ? !c.note 
                  : entityName === BOOKING_ENTITY_NAME && c.note)
                .map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormGroup>
        )}

        {children}
      </form> 
    </Modal>
  );
}