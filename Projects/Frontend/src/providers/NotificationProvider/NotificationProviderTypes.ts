import { Log } from "models/frontend/Log";
import { Notification } from "models/frontend/Notification";
import { Dispatch, SetStateAction } from "react";

export type NotificationProviderContextType = {
  logs: Array<Log>;
  addLog: (log: Log) => void;
  clearLogs: () => void;

  notifications: Array<Notification>;
  addNotification: (notification: Notification) => void;
}