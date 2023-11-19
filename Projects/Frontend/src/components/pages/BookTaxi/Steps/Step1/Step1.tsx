import FormGroup from "components/shared/FormGroup/FormGroup";
import { useSearchParams } from "react-router-dom";
import { BookingStepsPayload } from "../../BookTaxiTypes";

export default function Step1() {
  const [params] = useSearchParams();
  const defaultValue = params.has('booking') ? (JSON.parse(params.get('booking')!) as BookingStepsPayload).destination : undefined;

  return (
    <FormGroup label="Destination" htmlFor="destination">
      <input type="text" name="destination" id="destination" 
        placeholder="Frederikshavn Sygehus" defaultValue={defaultValue} 
      />
    </FormGroup>
  );
}