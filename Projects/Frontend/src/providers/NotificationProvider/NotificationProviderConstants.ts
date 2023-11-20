import { createContext } from "react";
import { NotificationProviderContextType } from "./NotificationProviderTypes";
import NotificationHubConnection from "./NotificationHubConnection";
import Events from "./Events";
import EventReducer from "./Events/_Setup/EventReducer";

export const NotificationProviderContext = createContext<NotificationProviderContextType>({
  logs: [],
  addLog: () => { },
  clearLogs: () => { },

  notifications: [],
  addNotification: () => { },
});

export const RegisterEvents = (
  context: NotificationProviderContextType
) => NotificationHubConnection.getInstance().reigster(
  Events,
  (event, ...args) => {
    try {
      return EventReducer(event, { args, ...context });
    } catch (error) {
      alert((error as Error).message);
    }
  }
);