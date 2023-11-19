import FormGroup from "components/shared/FormGroup";
import { useCitizen } from "providers/CitizenProvider";
import { translateEnum } from "utils";

export default function CitizenNoteInputs() {
  const { note } = useCitizen(true);

  return !note
    ? <p className="loading">Indlæser...</p>
    : (
      <form className="citizen-note-inputs">
        <FormGroup label="Bilhøjde" htmlFor="car-height">
          <input type="text" id="car-height" tabIndex={-1} readOnly defaultValue={translateEnum(note.carHeight)} />
        </FormGroup>

        <FormGroup label="Hjælpemidler" htmlFor="helping-util">
          <input type="text" id="helping-util" tabIndex={-1} readOnly defaultValue={translateEnum(note.helpingUtil)} />
        </FormGroup>

        <FormGroup label="Ledsager" htmlFor="companion">
          <input type="text" id="companion" tabIndex={-1} readOnly defaultValue={translateEnum(note.companion)} />
        </FormGroup>

        <FormGroup label="Følges" htmlFor="follow">
          <input type="text" id="follow" tabIndex={-1} readOnly defaultValue={translateEnum(note.follow)} />
        </FormGroup>

        <FormGroup label="Bopæl" htmlFor="residence">
          <input type="text" id="residence" tabIndex={-1} readOnly defaultValue={note.residence} />
        </FormGroup>
      </form>
    );
}