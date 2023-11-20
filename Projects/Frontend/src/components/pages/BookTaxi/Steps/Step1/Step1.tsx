import FormGroup from "components/shared/FormGroup/FormGroup";
import { useDefaultStepValue } from "../StepHooks";
import { getValidationMessage } from "../../BookTaxiConstants";
import { useState } from "react";

export default function Step1() {
  const defaultValue = useDefaultStepValue('destination');
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <FormGroup label="Destination" htmlFor="destination">
      <input type="text" name="destination" id="destination" 
        placeholder="Frederikshavn Sygehus"
        {...getValidationMessage('en destination', value, setValue)}
      />
    </FormGroup>
  );
}