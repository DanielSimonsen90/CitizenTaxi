import { BookingModifyPayload } from "models/backend/business/models/payloads";

export type BookingStepsPayload = Partial<Omit<BookingModifyPayload<false>, 'arrival'> & {
  date: string;
  time: string;
}>