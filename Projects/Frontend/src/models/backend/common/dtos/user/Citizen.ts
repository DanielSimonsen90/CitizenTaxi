import { Nullable } from "@types";
import { AUser } from "./AUser";
import { Booking } from "../Booking";
import { Note } from "../Note";

export type Citizen = AUser & {
  bookings: Array<Booking>;
  note: Nullable<Note>;
}