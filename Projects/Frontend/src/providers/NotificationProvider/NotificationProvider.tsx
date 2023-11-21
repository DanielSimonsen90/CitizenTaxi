import { useState, PropsWithChildren, useEffect } from 'react';

import { useCitizen } from 'providers/CitizenProvider';

import { NotificationProviderContext } from './NotificationProviderConstants';
import { NotificationProviderContextType } from './NotificationProviderTypes';
import { useEvents, useSubscribeToHub } from './NotificationProviderHooks';
import { Button, useEffectOnce } from 'danholibraryrjs';
import ActionReducer from './Actions/_Setup/ActionReducer';
import NotificationHubConnection from './NotificationHubConnection';

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

  useEffect(() => {
    NotificationHubConnection.getInstance().onreconnected(() => {
      context.clearLogs();
      ActionReducer('subscribe', { citizen: citizen as any });
    });
  }, [citizen]);

  return (
    <NotificationProviderContext.Provider value={context}>
      {children}
      <Button onClick={() => ActionReducer('ping', { citizen: citizen as any })}>Send ping</Button>
      <NotifyLogger logs={logs} />
    </NotificationProviderContext.Provider>
  );
}

function NotifyLogger({ logs }: Pick<NotificationProviderContextType, 'logs'>) {
  const [show, setShow] = useState(true);

  return (<>
    <Button onClick={() => setShow(show => !show)}>{show ? 'Hide' : 'Show'} log</Button>
    {show && (
      <ul>
        {logs.map((log, i) => (
          <li key={i}>[{log.timestamp.toLocaleTimeString()}] [{log.type}]: {log.message}</li>
        ))}
      </ul>
    )}
  </>);
}