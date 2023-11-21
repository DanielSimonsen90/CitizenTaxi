import { useContext } from "react";
import { NotificationContext } from "./NotificationProviderConstants";

export const useNotification = () => useContext(NotificationContext);