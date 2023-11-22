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
  })
}

export async function onCreateCitizenSubmit(
  payload: UserModifyPayload<false>, 
  setNotification: NotificationContextType['setNotification']
) {
  return onEntityCreateOrUpdate(payload, 'users', "create", setNotification, "borger");
}

export async function onEditCitizenSubmit(
  payload: UserModifyPayload<true>,
  setNotification: NotificationContextType['setNotification']
) {
  return onEntityCreateOrUpdate(payload, 'users', "update", setNotification, "borger");
}

export async function onDeleteCitizenSubmit(citizen: Citizen) {
  throw new Error("Not implemented");
}
