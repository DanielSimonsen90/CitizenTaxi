import { Nullable } from "types";
import { User } from "./AUser";
import { Booking } from "../Booking";
import { Note } from "../Note";

// The Citizen type should inherit properties from the AUser type and have the following additional properties:
export type Citizen = User & {
  bookings: Array<Booking>;
  note: Nullable<Note>;
}