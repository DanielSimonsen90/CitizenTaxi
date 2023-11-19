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
        {/* We don't want the user to be able to change the number, so we set tabIndex to -1 and readOnly to true */}
        <input type="tel" tabIndex={-1} readOnly defaultValue={DOCTORS_SECRETARY_PHONE} />
        <p className="or">eller</p>
        {/* 
          In production, the citizen could call the doctor's secretary assigned to them,
          but we don't want to actually call them, so we just alert the user that they could have called them
        */}
        <a href={`tel:${DOCTORS_SECRETARY_PHONE}`} onClick={(e) => {
          e.preventDefault();
          alert("Du kunne have ringet til lægesekretærene nu");
        }}>Ring til lægesekretærene direkte</a>
      </footer>
    </aside>
  );
}