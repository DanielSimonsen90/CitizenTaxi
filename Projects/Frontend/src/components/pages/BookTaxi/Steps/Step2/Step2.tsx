import FormGroup from "components/shared/FormGroup/FormGroup";
import { useDefaultStepValue } from "../StepHooks";
import { getValidationMessage } from "../../BookTaxiConstants";
import { useState } from "react";

export default function Step2() {
  const defaultDateValue = useDefaultStepValue('date');
  const defaultTimeValue = useDefaultStepValue('time');

  const [date, setDate] = useState(defaultDateValue ?? new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(defaultTimeValue ?? '12:00');

  return (
    <>
      <FormGroup label="Vælg dato" htmlFor="date">
        <input type="date" name="date" id="date"
          {...getValidationMessage('en dato', date, setDate)}
        />
      </FormGroup>

      <FormGroup label="Vælg tidspunkt" htmlFor="time">
        <input type="time" name="time" id="time" 
          {...getValidationMessage('et tidspunkt', time, setTime)}
        />
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