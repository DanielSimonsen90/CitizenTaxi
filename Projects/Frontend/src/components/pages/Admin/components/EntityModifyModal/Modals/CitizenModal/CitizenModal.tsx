import { useState } from "react";
import { Button } from "danholibraryrjs";

import EntityModifyModal, { EntityModifyModalProps } from "../../EntityModifyModal";
import { CreateCitizenSection, CreateNoteSection } from "./components";
import { UserModifyPayload } from "models/backend/business/models/payloads";
import { Citizen } from "models/backend/common";

type Props<TPayload, TEntity> = Pick<
  EntityModifyModalProps<TEntity, TPayload>,
  'crud' | 'onSubmit' | 'modalRef' | 'defaultModel'
>;

export default function CitizenModal({ modalRef, crud, defaultModel, onSubmit }: Props<UserModifyPayload<any>, Citizen>) {
  const [hidePassword, setHidePassword] = useState(true);
  const [showNoteSection, setShowNoteSection] = useState(false);

  return (
    <EntityModifyModal modalRef={modalRef} entityName="borger"
      crud={crud} onSubmit={onSubmit}
      payload={{} as UserModifyPayload<any>}
      defaultModel={defaultModel}
    >
      <CreateCitizenSection crud={crud} hidePassword={hidePassword}
        setHidePassword={setHidePassword} />

      {!showNoteSection && (
        <section className="button-container">
          <Button type="submit" importance="primary" crud={crud}>
            {crud === 'create' ? 'Opret' : 'Opdater'} borger
          </Button>
          {crud === 'create' && (
            <Button type="button" importance="secondary"
              className="alt" onClick={() => setShowNoteSection(true)}
            >
              Tilføj notat
            </Button>
          )}
        </section>
      )}

      {showNoteSection && (<>
        <hr />

        <CreateNoteSection />

        <section className="button-container">
          <Button type="submit" importance="primary">Opret borger</Button>
          <Button type="reset" importance="secondary"
            crud="delete" onClick={() => setShowNoteSection(false)}
          >
            Fortryd notat
          </Button>
        </section>
      </>)}
    </EntityModifyModal>
  );
}