import { BookingModifyPayload } from "models/backend/business/models/payloads";
import { Guid } from "types";

export type StepProps = {
  bookingId?: Guid;
}

export type StepData = {
  1: Pick<BookingModifyPayload<false>, 'destination'>
  2: Pick<BookingModifyPayload<false>, 'arrival'>
  3: Pick<BookingModifyPayload<false>, 'pickup'>
}