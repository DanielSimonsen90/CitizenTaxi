import { Root, createRoot } from 'react-dom/client';
import { NotificationProps, Notification } from 'components/shared/Notification';

// let root: Root;

export function showNotification(props: NotificationProps) {
  const notificationLayer = document.getElementById('notification-layer');
  if (!notificationLayer) return console.error('Could not find #notification-layer');

  const root = createRoot(notificationLayer);
  // root ??= createRoot(notificationLayer);
  root.render(<Notification close={() => {
    root.unmount();
    notificationLayer.innerHTML = '';
  }} {...props} />);
}