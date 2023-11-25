import FormGroup from "components/shared/FormGroup";
import { CarHeight, Companion, Follow, HelpingUtil } from "models/backend/common";
import { useCitizen } from "providers/CitizenProvider";
import { translateEnum } from "utils";

export default function CitizenNoteInputs() {
  // Note is set to nullable, as the citizen might not be loaded yet
  const { note } = useCitizen(true);

  return !note
    // If the note is not loaded yet, we show a loading message
    ? <p className="citizen-note-inputs loading">Intet notat endnu.</p>
    // Render read-only inputs with the note data
    : (
      <section className="citizen-note-inputs">
        <FormGroup label="Bilhøjde" htmlFor="car-height">
          <input type="text" tabIndex={-1} readOnly value={translateEnum(note.carHeight, CarHeight)} />
        </FormGroup>

        <FormGroup label="Hjælpemidler" htmlFor="helping-util">
          <input type="text" tabIndex={-1} readOnly value={translateEnum(note.helpingUtil, HelpingUtil)} />
        </FormGroup>

        <FormGroup label="Ledsager" htmlFor="companion">
          <input type="text" tabIndex={-1} readOnly value={translateEnum(note.companion, Companion)} />
        </FormGroup>

        <FormGroup label="Følges" htmlFor="follow">
          <input type="text" tabIndex={-1} readOnly value={translateEnum(note.follow, Follow)} />
        </FormGroup>

        <FormGroup label="Bopæl" htmlFor="residence">
          <input type="text" tabIndex={-1} readOnly value={note.residence} />
        </FormGroup>
      </section>
    );
}