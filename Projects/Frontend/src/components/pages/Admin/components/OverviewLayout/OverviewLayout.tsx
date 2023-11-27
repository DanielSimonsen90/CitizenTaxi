import { Dispatch, RefObject, SetStateAction, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, useAsyncEffectOnce, useUpdateEffect } from "danholibraryrjs";

import { ModalProps } from "components/shared/Modal/Modal";
import { useModalContentState } from "components/shared/Modal/ModalHooks";

import { Booking, Citizen, Note, Role } from "models/backend/common";
import { BaseEntity } from "models/backend/common/dtos/BaseEntity";

import { CitizenProvider } from "providers/CitizenProvider";
import { useApiActions } from "hooks";

import { CitizenCard } from "../CitizenCard";
import { FunctionComponent } from "types";

export type ModifyEntityModal<
  TEntity extends BaseEntity, P = {}
> = FunctionComponent<Pick<ModalProps, 'modalRef'> & { selected?: TEntity; } & P>;

type ModifyEntityModalProps<
  TEntityName extends string, 
  TEntity extends BaseEntity,
  AdditionalProps = {}
> = (
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
  mainCreateModal: FunctionComponent<Pick<ModalProps, 'modalRef'> & { selectedCitizen?: Citizen }>;

  citizens: Array<Citizen>;
  setCitizens: Dispatch<SetStateAction<Array<Citizen>>>;

  hideCitizens?: boolean;
  hideBookings?: boolean;
  hideNotes?: boolean;
};

export default function OverviewLayout({ 
  pageTitle, entity, 
  mainCreateModal: MainCreateModal,
  citizens, setCitizens,
  hideCitizens, hideBookings, hideNotes
}: Props) {
  const dispatch = useApiActions({ setCitizens });
  const mainCreateModalRef = useRef<HTMLDialogElement>(null);
  const [modalRef, setModalRef] = useState<RefObject<HTMLDialogElement> | undefined>(undefined);
  const [Modal, setModal] = useModalContentState();
  const [showModal, setShowModal] = useState(false);

  useAsyncEffectOnce(async () => {
    const citizens = await dispatch('getCitizens', undefined, { query: { role: `${Role.Citizen}` } })
    if (citizens) setCitizens(citizens);
  });

  useUpdateEffect(() => {
    if (showModal) modalRef?.current?.showModal();

    const closeListener = () => setShowModal(false);
    modalRef?.current?.addEventListener('close', closeListener);
    return () => modalRef?.current?.removeEventListener('close', closeListener);
  }, [showModal]);

  return (
    <main className="admin-overview" data-entity={entity}>
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
            <CitizenCard setCitizens={setCitizens} 
              hideCitizens={hideCitizens} hideBookings={hideBookings} hideNotes={hideNotes}
              onModalOpen={({ modal: Modal, modalRef }) => {
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