import { BaseEntity } from "./BaseEntity";

export type Booking = BaseEntity & {
  pickup: string;
  destination: string;
  arrival: Date;
  // citizen: Citizen;
}