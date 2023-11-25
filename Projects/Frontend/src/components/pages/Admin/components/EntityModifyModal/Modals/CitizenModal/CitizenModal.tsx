import { useState } from "react";
import { Button } from "danholibraryrjs";

import { EntityModifyExtendProps } from "../../EntityModifyModal";
import { CreateCitizenSection, CreateNoteSection } from "./components";
import { NoteModifyPayload, UserModifyPayload } from "models/backend/business/models/payloads";
import { Citizen } from "models/backend/common";
import { serializeForm } from "utils";
import Modal from "components/shared/Modal";

type Props = EntityModifyExtendProps<Citizen, UserModifyPayload<any>> & {
  onNoteSubmit?: (note: NoteModifyPayload<any>) => void;
};

export default function CitizenModal({ modalRef, crud, defaultModel, ...props }: Props) {
  const [hidePassword, setHidePassword] = useState(true);
  const [showNoteSection, setShowNoteSection] = useState(false);

  const onCitizenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    modalRef.current?.close();

    const data = serializeForm<UserModifyPayload<any>>(e.currentTarget);
    props.onSubmit(data);
  };
  const onCitizenWithNoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Create citizen
    const form = document.getElementById(`${crud}-borger-form`) as HTMLFormElement;
    const citizenPayload = serializeForm<UserModifyPayload<any>>(form);
    const closeModal = await props.onSubmit(citizenPayload);

    // Create note
    const notePayload = serializeForm<NoteModifyPayload<any>>(e.currentTarget);
    props.onNoteSubmit?.(notePayload);
    closeModal();
  };

  return (
    <Modal modalRef={modalRef} className={`borger-${crud}`}>
      <h1>{crud === 'create' ? 'Opret'
        : crud === 'update' ? 'Opdater'
          : 'Slet'} Borger</h1>
      <form id={`${crud}-borger-form`} onSubmit={onCitizenSubmit}>
        {crud !== 'create' && (
          <input type="hidden" name="id" value={defaultModel?.id} />
        )}

        <CreateCitizenSection crud={crud} hidePassword={hidePassword} defaultModel={defaultModel}
          setHidePassword={setHidePassword} />

        {!showNoteSection && (
          <section className="button-container">
            {crud === 'create' && (
              <Button type="button" importance="secondary"
                className="alt" onClick={() => setShowNoteSection(true)}
              >
                Tilføj notat
              </Button>
            )}
            <Button type="submit" importance="primary" crud={crud}>
              {crud === 'create' ? 'Opret' : 'Opdater'} borger
            </Button>
          </section>
        )}
      </form>

      {showNoteSection && (<>
        <hr />

        <form id={`crud-borger-notat-form`} onSubmit={onCitizenWithNoteSubmit}>
          <CreateNoteSection />

          <section className="button-container">
            <Button type="reset" importance="secondary" crud="delete" onClick={() => setShowNoteSection(false)}>
              Fortryd notat
            </Button>
            <Button type="submit" importance="primary" crud="create">Opret borger med notat</Button>
          </section>
        </form>
      </>)}
    </Modal>
  );
}