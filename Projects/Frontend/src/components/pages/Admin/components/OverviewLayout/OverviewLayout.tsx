import { RefObject, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, FunctionComponent, useUpdateEffect } from "danholibraryrjs";

import { ModalProps } from "components/shared/Modal/Modal";
import { Booking, Citizen, Note } from "models/backend/common";
import { BaseEntity } from "models/backend/common/dtos/BaseEntity";
import { CitizenProvider } from "providers/CitizenProvider";

import { CitizenCard } from "../CitizenCard";
import { useModalContentState } from "components/shared/Modal/ModalHooks";

export type ModifyEntityModal<
  TEntity extends BaseEntity, P = {}
> = FunctionComponent<Pick<ModalProps, 'modalRef'> & { selected?: TEntity; } & P>;

type ModifyEntityModalProps<
  TEntityName extends string, 
  TEntity extends BaseEntity,
  AdditionalProps = {}
> = (
  & Record<
    `${'create' | 'edit' | 'delete'}${TEntityName}ModalRef`, 
    RefObject<HTMLDialogElement>>
  & Record<
    `Create${TEntityName}Modal`, 
    FunctionComponent<Pick<ModalProps, 'modalRef'> & AdditionalProps>>
  & Record<
    `${'Edit' | 'Delete'}${TEntityName}Modal`, 
    ModifyEntityModal<TEntity, AdditionalProps>
  >
)
export type EntityModalProps = Partial<(
  & ModifyEntityModalProps<'Citizen', Citizen>
  & ModifyEntityModalProps<'Booking', Booking, { selectedCitizen?: Citizen }>
  & ModifyEntityModalProps<'Note', Note, { selectedCitizen?: Citizen }>
)>

type Props = {
  pageTitle: string;
  entity: string;
  citizens: Array<Citizen>;
  mainCreateModal: FunctionComponent<Pick<ModalProps, 'modalRef'> & { selectedCitizen?: Citizen }>;
};

export default function OverviewLayout({ pageTitle, entity, citizens, mainCreateModal: MainCreateModal }: Props) {
  const mainCreateModalRef = useRef<HTMLDialogElement>(null);
  const [modalRef, setModalRef] = useState<RefObject<HTMLDialogElement> | undefined>(undefined);
  const [Modal, setModal] = useModalContentState();
  const [showModal, setShowModal] = useState(false);

  useUpdateEffect(() => {
    if (showModal) modalRef?.current?.showModal();
    else modalRef?.current?.close();
  }, [showModal]);

  return (
    <main className="admin-overview">
      <header>
        <Link to='/' className="button secondary alt">Tilbage til oversigt</Link>
        <h1>{pageTitle}</h1>
        <Button type="button" importance="primary" crud="create"
          onClick={() => {
            setModalRef(mainCreateModalRef);
            setModal(<MainCreateModal modalRef={mainCreateModalRef} />);
            setShowModal(true);
          }}
        >Opret {entity}</Button>
      </header>

      <Modal />

      <section className="citizen-list" role="list">
        {citizens.map(citizen => (
          <CitizenProvider key={citizen.id} citizen={citizen}>
            <CitizenCard onModalOpen={({ modal: Modal, modalRef }) => {
                setModalRef(modalRef);
                setModal(<Modal />);
                setShowModal(true);
              }}
            />
          </CitizenProvider>
        ))}
      </section>
    </main>
  );
}