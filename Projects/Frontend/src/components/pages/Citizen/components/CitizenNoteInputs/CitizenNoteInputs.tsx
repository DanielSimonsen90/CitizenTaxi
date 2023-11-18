import FormGroup from "components/shared/FormGroup";
import { useCitizen } from "providers/CitizenProvider";
import { translateEnum } from "utils";

export default function CitizenNoteInputs() {
  const { note } = useCitizen(false);
  
  return (
    <form className="citizen-note-inputs">
      <FormGroup label="Bilhøjde" htmlFor="car-height">
        <input type="text" id="car-height" value={translateEnum(note.carHeight)} />
      </FormGroup>

      <FormGroup label="Hjælpemidler" htmlFor="helping-util">
        <input type="text" id="helping-util" value={translateEnum(note.helpingUtil)} />
      </FormGroup>

      <FormGroup label="Ledsager" htmlFor="companion">
        <input type="text" id="companion" value={translateEnum(note.companion)} />
      </FormGroup>
      
      <FormGroup label="Følges" htmlFor="follow">
        <input type="text" id="follow" value={translateEnum(note.follow)} />
      </FormGroup>

      <FormGroup label="Bopæl" htmlFor="residence">
        <input type="text" id="residence" value={note.residence} />
      </FormGroup>
    </form>
  );
}