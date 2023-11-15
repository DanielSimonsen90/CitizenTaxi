import { Guid } from "types";

// Generic "WithId" type is used to determine if the payload should contain an id or not
// TypeScript can dynamically add/remove properties from a type based on a generic type like this
export type BaseModifyPayload<WithId extends boolean> = 
  WithId extends true 
    ? { id: Guid; } // If the generic type passed is "true", then the payload should contain an id
    : {}; // If the generic type passed is "false", then the payload should not contain an id