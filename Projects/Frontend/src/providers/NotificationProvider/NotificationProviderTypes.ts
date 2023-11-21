export type NotificationContextType = {
  // notification: string;
  setNotification: (notification: NotificationProps) => void;
};

export type ToastNotificationTypes =
  | 'success'
  | 'info'
  | 'warning'
  | 'error';

export type NotificationProps = {
  message: string;
  type?: ToastNotificationTypes;
  duration?: number;
}