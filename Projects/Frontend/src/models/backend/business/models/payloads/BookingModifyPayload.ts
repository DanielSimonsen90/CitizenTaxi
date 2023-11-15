import { Guid } from "@types";
import { BaseModifyPayload } from "./BaseModifyPayload";
import { Booking } from "@models/backend/common";

export type BookingModifyPayload<WithId extends boolean> = BaseModifyPayload<WithId> 
  & Booking 
  & {
  citizenId: Guid;
}