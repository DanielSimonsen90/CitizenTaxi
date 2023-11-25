import { useCallback, useEffect, useRef } from "react";
import { classNames } from "danholibraryrjs";

const NOTIFICATION_TIMEOUT_S = 5;
const NOTIFICATION_ANIMATION_CLASSNAME = 'animating';

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

type Props = NotificationProps & {
  close(): void;
}

export function Notification({
  message, close,
  duration = NOTIFICATION_TIMEOUT_S,
  type = 'info',
}: Props) {
  const toastRef = useRef<HTMLDivElement>(null);
  const loadRef = useRef<HTMLHRElement>(null);
  const internalClose = useCallback(() => {
    if (!toastRef.current) return console.error(`Unable to find toast`);

    // Animate the notification out
    toastRef.current.classList.add(NOTIFICATION_ANIMATION_CLASSNAME);
    const transitionTime = parseFloat(getComputedStyle(toastRef.current).getPropertyValue('--transition-time'));
    setTimeout(close, transitionTime);
  }, [toastRef, close]);

  useEffect(() => {
    if (!toastRef.current) return;

    // When the notification is mounted, animate it in
    toastRef.current.addEventListener('animationend', () => {
      if (!loadRef.current) return console.error(`Unable to find loader`);

      // Animate the loader by changing its internal lifespan
      loadRef.current.style.setProperty('--_lifespan', `${duration}s`);
      loadRef.current.addEventListener('animationend', internalClose, { once: true });
    }, { once: true });
  }, [toastRef, loadRef, duration, internalClose]);

  return message ? (
    <section ref={toastRef} className={classNames('notification', `notification--${type}`)}>
      <header>
        <h1>{type === 'success' ? 'Succes' : 'Fejl'}</h1>
        <span onClick={internalClose}>&times;</span>
      </header>
      <p>{message}</p>
      <div className="load-wrapper">
        <hr ref={loadRef} />
      </div>
    </section>
  ) : null;
}