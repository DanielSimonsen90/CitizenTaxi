import { ActionRegisterProps, HubActionNames } from "./_Setup/HubActionTypes";
import SubscribeAction from "./subscribe.action";

export default {
  subscribe: SubscribeAction,
} as Record<HubActionNames, ActionRegisterProps<HubActionNames>>;