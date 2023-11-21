import { createContext } from "react";
import { NotificationContextType } from "./NotificationProviderTypes";

export const NotificationContext = createContext<NotificationContextType>({
  // notification: "",
  setNotification: () => {},
});

export const NOTIFICATION_TIMEOUT_S = 5;