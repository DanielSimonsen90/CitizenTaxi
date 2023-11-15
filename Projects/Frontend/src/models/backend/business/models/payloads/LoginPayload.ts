import { BaseModifyPayload } from "./BaseModifyPayload";

// Generic "WithId" type is used to determine if the payload should contain an id or not
// This is handled by the BaseModifyPayload type
export type LoginPayload = BaseModifyPayload<false> & {
  username: string;
  password: string;
}