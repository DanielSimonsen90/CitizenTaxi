import { NotificationProviderContextType } from "providers/NotificationProvider/NotificationProviderTypes";

export type HubEvents = {
  notified: [timestamp: string, message: string];
  log: [timestamp: string, type: string, message: string];
  error: [message: string];
};
export type HubEventNames = keyof HubEvents;

export type EventProps<Event extends HubEventNames> = {
  args: HubEvents[Event];
} & NotificationProviderContextType;

export type EventRegisterProps<Event extends HubEventNames> = {
  event: Event,
  callback: (props: EventProps<Event>) => Promise<void>;
};