import { Note } from "@models/backend/common";
import { Guid } from "@types";
import { BaseModifyPayload } from "./BaseModifyPayload";

// Generic "WithId" type is used to determine if the payload should contain an id or not
// This is handled by the BaseModifyPayload type
export type NoteModifyPayload<WithId extends boolean> = BaseModifyPayload<WithId> 
  & Note // Copy all NoteDTO properties into the payload
  & {
  citizenId: Guid; // Id of the citizen the note is for
}