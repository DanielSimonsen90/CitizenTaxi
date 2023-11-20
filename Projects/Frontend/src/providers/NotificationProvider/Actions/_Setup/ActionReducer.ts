import { AUTH_COOKIE_NAME, Request } from "utils";
import NotificationHubConnection from "providers/NotificationProvider/NotificationHubConnection";
import { AuthTokens } from "models/backend/business/models/AuthTokens";

import { ActionProps, HubActionNames } from "./HubActionTypes";
import Actions from "..";

export type ActionReducerProps<Action extends HubActionNames> = Pick<ActionProps<Action>, 'citizen'>;

export default async function ActionReducer<Action extends HubActionNames>(
  action: Action,
  { citizen }: ActionReducerProps<Action>
): Promise<void> {
  if (!Actions[action]) throw new Error(`Action ${action} not found`);
  const { callback } = Actions[action];
  const connection = NotificationHubConnection.getInstance();

  try {
    return await callback({
      citizen,
      request: Request,
      authTokens: getAuthTokens(),
      broadcast: (...args) => connection.send(action, ...args),
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function getAuthTokens() {
  const authCookie = document.cookie
    .split(';')
    .find(cookie => cookie.includes(AUTH_COOKIE_NAME));

  if (!authCookie) throw new Error(`No cookie found with name ${AUTH_COOKIE_NAME}`);

  const authCookieValue = authCookie.split('=')[1];
  const authTokens = JSON.parse(atob(authCookieValue)) as AuthTokens;

  // Convert authTokens.accessToken's and .refreshToken's .expiresIn to Date objects
  authTokens.accessToken.expiresAt = new Date(authTokens.accessToken.expiresAt);
  authTokens.refreshToken.expiresAt = new Date(authTokens.refreshToken.expiresAt);

  return authTokens;
}