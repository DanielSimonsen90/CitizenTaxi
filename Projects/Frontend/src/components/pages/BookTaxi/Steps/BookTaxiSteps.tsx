import { useParams } from "react-router-dom";
import { getStepData } from "../BookTaxiConstants";

export default function BookTaxiSteps() {
  const { step = '1', bookingId } = useParams();
  const { component: Component } = getStepData(step);

  return <Component bookingId={bookingId} />
}