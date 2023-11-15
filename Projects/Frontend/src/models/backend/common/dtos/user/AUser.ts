import { Role } from "../../Enums";
import { BaseEntity } from "../BaseEntity";

// The AUser type should inherit properties from the BaseEntity type and have the following additional properties:
export type AUser = BaseEntity & {
  name: string;
  role: Role;
}