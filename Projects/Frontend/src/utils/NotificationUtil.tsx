import { Root, createRoot } from 'react-dom/client';
import { NotificationProps, Notification } from 'components/shared/Notification';
import { Nullable } from 'types';

let root: Nullable<Root> = null;

export function showNotification(props: NotificationProps) {
  const notificationLayer = document.getElementById('notification-layer');
  if (!notificationLayer) return console.error('Could not find #notification-layer');

  // const root = createRoot(notificationLayer);
  root ??= createRoot(notificationLayer);
  root.render(<Notification close={() => {
    root?.unmount();
    root = null;
    notificationLayer.innerHTML = '';
  }} {...props} />);
  
  if (props.message) console.log(`[Notification]: ${props.type ?? 'info'} - ${props.message}`)
}