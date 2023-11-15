import { CarHeight, Companion, Follow, HelpingUtil } from "../Enums";
import { BaseEntity } from "./BaseEntity";

export type Note = BaseEntity & {
  pensioner: boolean;
  residence: string;
  carHeight: CarHeight;
  helpingUtil: HelpingUtil;
  companion: Companion;
  follow: Follow;
}