import { ActionRegisterProps, HubActionNames } from "./_Setup/HubActionTypes";
import SubscribeAction from "./subscribe.action";
import PingAction from "./ping.action";

export default {
  subscribe: SubscribeAction,
  ping: PingAction
} as Record<HubActionNames, ActionRegisterProps<HubActionNames>>;