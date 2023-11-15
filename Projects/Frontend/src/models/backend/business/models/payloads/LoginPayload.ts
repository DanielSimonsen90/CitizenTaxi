import { BaseModifyPayload } from "./BaseModifyPayload";

export type LoginPayload = BaseModifyPayload<false> & {
  username: string;
  password: string;
}