import FormGroup from "components/shared/FormGroup/FormGroup";
import { useDefaultStepValue } from "../StepHooks";

export default function Step1() {
  const defaultValue = useDefaultStepValue('destination');

  return (
    <FormGroup label="Destination" htmlFor="destination">
      <input type="text" name="destination" id="destination" 
        placeholder="Frederikshavn Sygehus" defaultValue={defaultValue} 
      />
    </FormGroup>
  );
}