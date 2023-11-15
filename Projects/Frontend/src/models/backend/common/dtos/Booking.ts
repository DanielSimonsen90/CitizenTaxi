import { BaseEntity } from "./BaseEntity";

// The Booking type should inherit properties from the BaseEntity type and have the following additional properties:
export type Booking = BaseEntity & {
  pickup: string;
  destination: string;
  arrival: Date;
}