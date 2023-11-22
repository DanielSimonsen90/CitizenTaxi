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
  const [hidePassword, setHidePassword] = useState(false);
  const [showNoteSection, setShowNoteSection] = useState(false);

  return (
    <EntityModifyModal modalRef={modalRef} entityName="borger"
      crud={crud} onSubmit={onSubmit} 
      payload={{} as UserModifyPayload<any>}
      defaultModel={defaultModel}
    >
      <CreateCitizenSection hidePassword={hidePassword} 
        setHidePassword={setHidePassword} />

      {!showNoteSection
        ? <section className="button-container">
          <Button type="submit" importance="primary">Opret borger</Button>
          {crud === 'create' && (
            <Button type="button" importance="secondary" 
              className="alt" onClick={() => setShowNoteSection(true)}
            >
              Tilføj notat
            </Button>
          )}
        </section>
        : null
      }

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