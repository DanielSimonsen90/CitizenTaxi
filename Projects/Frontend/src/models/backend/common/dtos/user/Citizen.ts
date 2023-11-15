import { Nullable } from "@types";
import { AUser } from "./AUser";
import { Booking } from "../Booking";
import { Note } from "../Note";

// The Citizen type should inherit properties from the AUser type and have the following additional properties:
export type Citizen = AUser & {
  bookings: Array<Booking>;
  note: Nullable<Note>;
}