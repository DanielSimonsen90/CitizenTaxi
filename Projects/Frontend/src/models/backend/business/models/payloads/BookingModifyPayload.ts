import { Guid } from "@types";
import { BaseModifyPayload } from "./BaseModifyPayload";
import { Booking } from "@models/backend/common";

// Generic "WithId" type is used to determine if the payload should contain an id or not
// This is handled by the BaseModifyPayload type
export type BookingModifyPayload<WithId extends boolean> = BaseModifyPayload<WithId> 
  & Booking // Copy all BookingDTO properties into the payload
  & {
  citizenId: Guid; // Id of the citizen the booking is for
}