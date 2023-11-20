import { useState } from "react";
import FormGroup from "components/shared/FormGroup";
import { useDefaultStepValue } from "../StepHooks";
import { getValidationMessage } from "../../BookTaxiConstants";

export default function Step3() {
  const defaultValue = useDefaultStepValue("pickup");
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <FormGroup label="Afhentning" htmlFor="pickup">
      <input type="text" name="pickup" id="pickup"
        placeholder="Solvej 10, 0000 God by"
        {...getValidationMessage("en afhentningsadresse", value, setValue)}
      />
    </FormGroup>
  );
}