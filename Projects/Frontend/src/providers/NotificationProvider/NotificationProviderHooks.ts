import { useContext } from "react";
import { NotificationProviderContext } from "./NotificationProviderConstants";

export const useNotifications = () => useContext(NotificationProviderContext);