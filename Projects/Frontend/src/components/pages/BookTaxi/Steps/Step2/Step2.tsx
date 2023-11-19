import FormGroup from "components/shared/FormGroup/FormGroup";
import { useDefaultStepValue } from "../StepHooks";

export default function Step2() {
  const defaultDateValue = useDefaultStepValue('date');
  const defaultTimeValue = useDefaultStepValue('time');

  return (
    <>
      <FormGroup label="Vælg dato" htmlFor="date">
        <input type="date" name="date" id="date" defaultValue={defaultDateValue} />
      </FormGroup>

      <FormGroup label="Vælg tidspunkt" htmlFor="time">
        <input type="time" name="time" id="time" defaultValue={defaultTimeValue} />
      </FormGroup>
    </>
  );
}

/*

http://localhost:3000/bestil/3?booking={%22destination%22:%22Frederikshavn%20sygehus%22,%22date%22:%222023-11-19%22}
as json would be:
{
  "destination": "Frederikshavn sygehus",
  "date": "2023-11-19"
}
*/