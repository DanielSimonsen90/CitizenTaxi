import { BaseModifyPayload, UserModifyPayload, NoteModifyPayload, BookingModifyPayload } from "models/backend/business/models/payloads";
import { Citizen, Note, Booking } from "models/backend/common";
import { BaseEntity } from "models/backend/common/dtos/BaseEntity";
import { Nullable, Guid } from "types";
import { RequestOptions } from "./ApiTypes";

type CloseModalFunction = () => void;

type InternalEntityActionReturnType<
  TEntityName extends string,
  TEntity extends BaseEntity
> = (
    & Record<`create${Capitalize<TEntityName>}`, CloseModalFunction>
    & Record<`get${Capitalize<TEntityName>}s`, Array<TEntity>>
    & Record<`get${Capitalize<TEntityName>}`, Nullable<TEntity>>
    & Record<`update${Capitalize<TEntityName>}`, CloseModalFunction>
    & Record<`delete${Capitalize<TEntityName>}`, CloseModalFunction>
  );
export type ActionReturnTypes = (
  & InternalEntityActionReturnType<'citizen', Citizen>
  & InternalEntityActionReturnType<'note', Note>
  & InternalEntityActionReturnType<'booking', Booking>
);

type InternalEntityAction<
  TEntityName extends string,
  TEntity extends BaseEntity,
  TCreatePayload extends BaseModifyPayload<false>,
  TUpdatePayload extends BaseModifyPayload<true>
> = (
    & Record<`create${Capitalize<TEntityName>}`, [payload: TCreatePayload]>
    & Record<`get${Capitalize<TEntityName>}s`, [citizenId?: Guid, options?: RequestOptions]>
    & Record<`get${Capitalize<TEntityName>}`, [entityId: TEntity['id'], options?: RequestOptions]>
    & Record<`update${Capitalize<TEntityName>}`, [payload: TUpdatePayload]>
    & Record<`delete${Capitalize<TEntityName>}`, [entityId: TEntity['id']]>
  );
export type Actions = (
  & InternalEntityAction<'citizen', Citizen, UserModifyPayload<false>, UserModifyPayload<true>>
  & InternalEntityAction<'note', Note, NoteModifyPayload<false>, NoteModifyPayload<true>>
  & InternalEntityAction<'booking', Booking, BookingModifyPayload<false>, BookingModifyPayload<true>>
);

export type ActionNames = keyof Actions;