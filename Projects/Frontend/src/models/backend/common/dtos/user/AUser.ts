import { Role } from "../../Enums";
import { BaseEntity } from "../BaseEntity";

export type AUser = BaseEntity & {
  name: string;
  role: Role;
}