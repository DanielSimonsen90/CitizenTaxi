import ErrorEvent from './error.event';
import NotifiedEvent from './notified.event';
import LogEvent from './log.event';
import { EventRegisterProps, HubEventNames } from './_Setup/HubEventTypes';

export default {
  error: ErrorEvent,
  notified: NotifiedEvent,
  log: LogEvent,
} as Record<HubEventNames, EventRegisterProps<HubEventNames>>;