import { useState, PropsWithChildren } from 'react';

import { useCitizen } from 'providers/CitizenProvider';

import { NotificationProviderContext } from './NotificationProviderConstants';
import { NotificationProviderContextType } from './NotificationProviderTypes';
import { useEvents, useSubscribeToHub } from './NotificationProviderHooks';

export default function NotificationProviderProvider({ children }: PropsWithChildren) {
  const [notifications, setNotifications] = useState<NotificationProviderContextType['notifications']>([]);
  const [logs, setLogs] = useState<NotificationProviderContextType['logs']>([]);

  const context: NotificationProviderContextType = {
    notifications, logs,
    addNotification: (notification) => setNotifications(notifications => [...notifications, notification]),
    addLog: (log) => setLogs(logs => [...logs, log]),
    clearLogs: () => setLogs([]),
  };

  useEvents(context);

  const { citizen } = useCitizen(true);
  useSubscribeToHub(citizen);

  return (
    <NotificationProviderContext.Provider value={context}>
      {children}
    </NotificationProviderContext.Provider>
  );
}