import { useState, PropsWithChildren } from 'react';
import { NotificationContext } from './NotificationProviderConstants';
import Notification from './Notification';
import { NotificationProps } from './NotificationProviderTypes';

export default function NotificationProviderProvider({ children }: PropsWithChildren) {
  const [notification, setNotification] = useState<NotificationProps>({
    message: "",
  });
  
  return (
    <NotificationContext.Provider value={{ setNotification }}>
      {children}
      <Notification close={() => setNotification({ message: '' })} {...notification} />
    </NotificationContext.Provider>
  );
}