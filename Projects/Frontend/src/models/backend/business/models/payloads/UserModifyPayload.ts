import { User } from "models/backend/common/dtos";
import { LoginPayload } from "./LoginPayload";
import { BaseModifyPayload } from "./BaseModifyPayload";

// Generic "WithId" type is used to determine if the payload should contain an id or not
// This is handled by the BaseModifyPayload type
export type UserModifyPayload<WithId extends boolean> = BaseModifyPayload<WithId> 
  & Omit<User, 'id'> // Copy all UserDTO properties apart from id into the payload
  & LoginPayload // Copy all LoginPayload properties into the payload
  & {
  email?: string; // Email can be provided, but is not required as it's (for now) only used for the Citizen entity
}