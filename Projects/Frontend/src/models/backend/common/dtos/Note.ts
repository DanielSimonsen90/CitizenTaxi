import { CarHeight, Companion, Follow, HelpingUtil } from "../Enums";
import { BaseEntity } from "./BaseEntity";

// The Note type should inherit properties from the BaseEntity type and have the following additional properties:
export type Note = BaseEntity & {
  pensioner: boolean;
  residence: string;
  carHeight: CarHeight;
  helpingUtil: HelpingUtil;
  companion: Companion;
  follow: Follow;
}