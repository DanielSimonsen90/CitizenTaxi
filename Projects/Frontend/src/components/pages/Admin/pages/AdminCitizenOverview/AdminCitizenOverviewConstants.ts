import { UserModifyPayload } from "models/backend/business/models/payloads";
import { Citizen } from "models/backend/common";

export function onViewAllBookings(citizen: Citizen) {
  throw new Error("Not implemented");
}

export async function onCreateCitizenSubmit(payload: UserModifyPayload<false>) {
  throw new Error("Not implemented");
}

export async function onEditCitizenSubmit(payload: UserModifyPayload<true>) {
  throw new Error("Not implemented");
}

export async function onDeleteCitizenSubmit(citizen: Citizen) {
  throw new Error("Not implemented");
}
