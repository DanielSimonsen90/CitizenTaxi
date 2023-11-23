import { BaseModifyPayload, UserModifyPayload } from "models/backend/business/models/payloads";
import { Citizen } from "models/backend/common";
import { NotificationContextType } from "providers/NotificationProvider/NotificationProviderTypes";
import { Guid } from "types";
import { ApiEndpoints, Request } from "utils";

export function onViewAllBookings(citizen: Citizen) {
  throw new Error("Not implemented");
}

async function onEntityCreateOrUpdate<
  TPayload extends BaseModifyPayload<any>
>(
  payload: TPayload,
  endpoint: ApiEndpoints<Guid>,
  type: "create" | "update",
  setNotification: NotificationContextType['setNotification'],
  modelName: string
) {
  const response = await Request(
    type === 'update'
      && 'id' in payload
      ? `${endpoint}/${payload.id}`
      : endpoint,
    {
      method: type === "create" ? "POST" : "PUT",
      body: payload
    });

  if (!response.success) console.error(response.text);

  setNotification({
    type: response.success ? 'success' : 'error',
    message: response.success
      ? `${modelName} blev ${type === 'create' ? 'oprettet' : 'opdateret'}.`
      : `Der skete en fejl under ${type === 'create' ? 'oprettelse' : 'opdatering'} af ${modelName}.`
  });
}

export const getCitizenSubmits = (
  setNotification: NotificationContextType['setNotification']
) => ({
  onCreateCitizenSubmit: (payload: UserModifyPayload<false>) => onEntityCreateOrUpdate(payload, 'users', "create", setNotification, "borgeren"),
  onEditCitizenSubmit: (payload: UserModifyPayload<true>) => onEntityCreateOrUpdate(payload, 'users', "update", setNotification, "borgeren")
});

export const getBookingSubmits = (
  setNotification: NotificationContextType['setNotification']
) => ({
  onCreateBookingSubmit: (payload: any) => onEntityCreateOrUpdate(payload, 'bookings', "create", setNotification, "bestillingen"),
  onEditBookingSubmit: (payload: any) => onEntityCreateOrUpdate(payload, 'bookings', "update", setNotification, "bestillingen")
});

export const getNoteSubmits = (
  setNotification: NotificationContextType['setNotification']
) => ({
  onCreateNoteSubmit: (payload: any) => onEntityCreateOrUpdate(payload, 'notes', "create", setNotification, "notatet"),
  onEditNoteSubmit: (payload: any) => onEntityCreateOrUpdate(payload, 'notes', "update", setNotification, "notatet")
});