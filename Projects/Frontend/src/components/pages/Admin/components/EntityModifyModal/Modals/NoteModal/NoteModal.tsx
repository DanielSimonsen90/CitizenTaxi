import { Button } from "danholibraryrjs";

import EnumSelect from "components/shared/EnumSelect";
import FormGroup from "components/shared/FormGroup";

import { NoteModifyPayload } from "models/backend/business/models/payloads";
import { Note, CarHeight, HelpingUtil, Companion, Follow } from "models/backend/common";

import EntityModifyModal, { EntityModifyExtendProps } from "../../EntityModifyModal";

export default function NoteModal({ 
  modalRef, crud,
  defaultModel, selectedCitizen,
  ...props 
}: EntityModifyExtendProps<Note, NoteModifyPayload<any>>) {

  async function onSubmit(model: NoteModifyPayload<any>) {
    modalRef.current?.close();
    return await props.onSubmit(model);
  }

  return (
    <EntityModifyModal modalRef={modalRef} entityName="notat"
      crud={crud} onSubmit={onSubmit} 
      defaultModel={defaultModel} selectedCitizen={selectedCitizen}
      payload={{} as NoteModifyPayload<any>}
    >

      <FormGroup label="Bilhøjde" htmlFor={`${crud}-note-carHeight`}>
        <EnumSelect name="carHeight" id={`${crud}-note-carHeight`} enumType={CarHeight} defaultValue={defaultModel?.carHeight} />
      </FormGroup>

      <FormGroup label="Hjælpemiddel" htmlFor={`${crud}-note-helpingUtil`}>
        <EnumSelect name="helpingUtil" id={`${crud}-note-helpingUtil`} enumType={HelpingUtil} defaultValue={defaultModel?.helpingUtil} />
      </FormGroup>

      <FormGroup label="Ledsager" htmlFor={`${crud}-note-companion`}>
        <EnumSelect name="companion" id={`${crud}-note-companion`} enumType={Companion} defaultValue={defaultModel?.companion} />
      </FormGroup>

      <FormGroup label="Følgning" htmlFor={`${crud}-note-follow`}>
        <EnumSelect name="follow" id={`${crud}-note-follow`} enumType={Follow} defaultValue={defaultModel?.follow} />
      </FormGroup>

      <FormGroup label="Bopæl" htmlFor={`${crud}-note-residence`}>
        <input type="text" name="residence" id={`${crud}-note-residence`} defaultValue={defaultModel?.residence} />
      </FormGroup>

      <footer className="button-container">
        <Button type="button" importance="secondary" crud='delete'
          onClick={() => modalRef.current?.close()}
        >Fortryd</Button>
        <Button type="submit" crud={crud}>{crud === 'create' ? 'Opret' : 'Opdater'} notat</Button>
      </footer>
    </EntityModifyModal>
  );
}