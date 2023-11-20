import { createContext } from "react";
import { NotificationProviderContextType } from "./NotificationProviderTypes";

export const NotificationProviderContext = createContext<NotificationProviderContextType>({
  logs: [],
  addLog: () => {},
  clearLogs: () => {},

  notifications: [],
  addNotification: () => {},
})