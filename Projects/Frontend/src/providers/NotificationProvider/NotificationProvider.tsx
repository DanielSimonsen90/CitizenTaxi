import { useState, PropsWithChildren } from 'react';
import { NotificationProviderContext } from './NotificationProviderConstants';
import { NotificationProviderContextType } from './NotificationProviderTypes';

export default function NotificationProviderProvider({ children }: PropsWithChildren) {
  const [notifications, setNotifications] = useState<NotificationProviderContextType['notifications']>([]);
  const [logs, setLogs] = useState<NotificationProviderContextType['logs']>([]);

  return (
    <NotificationProviderContext.Provider value={{
      notifications, logs,
      addNotification: (notification) => setNotifications(notifications => [...notifications, notification]),
      addLog: (log) => setLogs(logs => [...logs, log]),
      clearLogs: () => setLogs([]),
    }}>
      {children}
    </NotificationProviderContext.Provider>
  );
}