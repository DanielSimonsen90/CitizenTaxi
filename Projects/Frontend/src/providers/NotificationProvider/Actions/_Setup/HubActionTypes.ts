import { AuthTokens } from "models/backend/business/models/AuthTokens";
import { Citizen } from "models/backend/common";
import { Guid } from "types";
import type { Request } from "utils";

/**
 * These actions are emitted to the server from the client
 * Client -> Server
 */
export type HubActions = {
  subscribe: [accessToken: string, citizenId: Guid];
  ping: [];
}

export type HubActionNames = keyof HubActions;

export type ActionProps<Action extends HubActionNames> = {
  authTokens: AuthTokens;
  citizen: Citizen;
  
  request: typeof Request;
  broadcast: (...args: HubActions[Action]) => void;
}

export type ActionRegisterProps<Action extends HubActionNames> = {
  action: Action,
  callback: (props: ActionProps<Action>) => Promise<void>
}