import { AUser } from "@models/backend/common/dtos/user/AUser";
import { LoginPayload } from "./LoginPayload";
import { BaseModifyPayload } from "./BaseModifyPayload";

export type UserModifyPayload<WithId extends boolean> = BaseModifyPayload<WithId> 
  & AUser 
  & LoginPayload 
  & {
  email?: string;
}