import EnumSelect from "components/shared/EnumSelect";
import FormGroup from "components/shared/FormGroup";
import { CarHeight, HelpingUtil, Companion, Follow } from "models/backend/common";

export const CreateNoteSection = () => (
  <section className="create-note">
    <FormGroup label="Bilhøjde" htmlFor="note-carHeight">
      <EnumSelect id="note-carHeight" name="carHeight" enumType={CarHeight} />
    </FormGroup>

    <FormGroup label="Hjælpemiddel" htmlFor="note-helpingUtil">
      <EnumSelect id="note-helpingUtil" name="helpingUtil" enumType={HelpingUtil} />
    </FormGroup>

    <FormGroup label="Ledsager" htmlFor="note-companion">
      <EnumSelect id="note-companion" name="companion" enumType={Companion} />
    </FormGroup>

    <FormGroup label="Følges" htmlFor="note-follow">
      <EnumSelect id="note-follow" name="follow" enumType={Follow} />
    </FormGroup>

    <FormGroup label="Bopæl" htmlFor="note-residence">
      <input type="text" id="note-residence" name="residence" />
    </FormGroup>
  </section>
);