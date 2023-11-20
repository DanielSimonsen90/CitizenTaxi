import { EventRegisterProps, HubEventNames } from "./HubEventTypes";

export default function CreateEvent<Event extends HubEventNames>(
  event: Event,
  callback: EventRegisterProps<Event>['callback'],
) {
  return {
    event,
    callback,
  };
}