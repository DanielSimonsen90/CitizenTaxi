import { DOCTORS_SECRETARY_PHONE } from "SiteConstants";
import CitizenNoteInputs from "../CitizenNoteInputs";

export default function CitizenNote() {
  return (
    <aside className="citizen-note">
      <h2>Dit notat</h2>

      <CitizenNoteInputs />

      <footer className="wrong-note">
        <h3 className="secondary">Er dit notat forkert?</h3>
        <p className="secondary">Du kan ringe til lægesekretærene og få det rettet med nummeret:</p>
        <input type="tel" tabIndex={-1} readOnly defaultValue={DOCTORS_SECRETARY_PHONE} />
        <p className="or">eller</p>
        <a href={`tel:${DOCTORS_SECRETARY_PHONE}`} onClick={(e) => {
          e.preventDefault();
          alert("Du kunne have ringet til lægesekretærene nu");
        }}>Ring til lægesekretærene direkte</a>
      </footer>
    </aside>
  );
}