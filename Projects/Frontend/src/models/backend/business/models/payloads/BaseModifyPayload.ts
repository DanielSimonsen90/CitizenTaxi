import { Guid } from "@types";

export type BaseModifyPayload<WithId extends boolean> = 
  WithId extends true 
    ? { id: Guid; }
    : {};