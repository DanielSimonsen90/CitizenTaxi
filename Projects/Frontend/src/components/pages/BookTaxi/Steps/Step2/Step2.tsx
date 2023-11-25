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