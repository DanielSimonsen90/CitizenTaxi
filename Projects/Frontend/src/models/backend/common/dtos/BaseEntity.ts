import { Guid } from "types";

// BaseEntity<TId> translated to BaseEntity. All entities have a Guid id, so no need to pass it in through a generic type
export type BaseEntity = {
  id: Guid;
}