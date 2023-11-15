import { Note } from "@models/backend/common";
import { Guid } from "@types";
import { BaseModifyPayload } from "./BaseModifyPayload";

export type NoteModifyPayload<WithId extends boolean> = BaseModifyPayload<WithId> 
  & Note 
  & {
  citizenId: Guid;
}