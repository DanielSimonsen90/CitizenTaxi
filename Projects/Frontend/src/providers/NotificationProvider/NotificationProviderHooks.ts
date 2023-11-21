import { useContext, useEffect } from "react";
import { NotificationProviderContext, RegisterEvents } from "./NotificationProviderConstants";
import { NotificationProviderContextType } from "./NotificationProviderTypes";
import { Citizen } from "models/backend/common";
import ActionReducer from "./Actions/_Setup/ActionReducer";
import { Nullable } from "types";
import NotificationHubConnection from "./NotificationHubConnection";

export const useNotifications = () => useContext(NotificationProviderContext);

export const useEvents = (
  context: NotificationProviderContextType
) => useEffect(() => {
  RegisterEvents(context);
}, [context]);

export const useSubscribeToHub = (citizen: Nullable<Citizen>) => {
  useEffect(() => {
    if (!citizen) return;

    ActionReducer('subscribe', { citizen });
  }, [citizen, citizen?.id]);
};