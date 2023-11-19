import FormGroup from "components/shared/FormGroup";
import { useDefaultStepValue } from "../StepHooks";

export default function Step3() {
  const defaultValue = useDefaultStepValue("pickup");

  return (
    <FormGroup label="Afhentning" htmlFor="pickup">
      <input type="text" name="pickup" id="pickup"
        placeholder="Solvej 10, 0000 God by" defaultValue={defaultValue}
      />
    </FormGroup>
  );
}