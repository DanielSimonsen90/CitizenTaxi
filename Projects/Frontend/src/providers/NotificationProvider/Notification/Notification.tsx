import { useEffect, useRef } from "react";
import { classNames, useEffectOnce } from "danholibraryrjs";
import { NOTIFICATION_TIMEOUT_S } from "../NotificationProviderConstants";
import { NotificationProps } from "../NotificationProviderTypes";



type Props = NotificationProps & {
  close(): void;
}

export default function Notification({
  message, close,
  duration = NOTIFICATION_TIMEOUT_S,
  type = 'info',
}: Props) {
  
  const toastRef = useRef<HTMLDivElement>(null);
  const loadRef = useRef<HTMLHRElement>(null);

  useEffect(() => {
    if (!toastRef.current) return;

    toastRef.current.addEventListener('animationend', () => {
      if (!loadRef.current) return console.error(`Unable to find loader`);

      loadRef.current.style.setProperty('--_lifespan', `${duration}s`);
      loadRef.current.addEventListener('animationend', () => {
        if (!toastRef.current) return console.error(`Unable to find toast`);

        toastRef.current.classList.add('animating');
        const transitionTime = parseFloat(getComputedStyle(toastRef.current).getPropertyValue('--transition-time'));
        setTimeout(close, transitionTime);
      }, { once: true });
    }, { once: true });
  }, [toastRef.current]);

  return message ? (
    <section ref={toastRef} className={classNames('notification', `notification--${type}`)}>
      <header>
        <h1>{type}</h1>
        <span onClick={close}>&times;</span>
      </header>
      <p>{message}</p>
      <div className="load-wrapper">
        <hr ref={loadRef} />
      </div>
    </section>
  ) : null;
}