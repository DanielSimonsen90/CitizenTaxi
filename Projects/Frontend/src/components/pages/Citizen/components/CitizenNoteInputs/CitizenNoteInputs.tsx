import FormGroup from "components/shared/FormGroup";
import { useCitizen } from "providers/CitizenProvider";
import { translateEnum } from "utils";

export default function CitizenNoteInputs() {
  // Note is set to nullable, as the citizen might not be loaded yet
  const { note } = useCitizen(true);

  return !note
    // If the note is not loaded yet, we show a loading message
    ? <p className="loading">Ingen note endnu.</p>
    // Render read-only inputs with the note data
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