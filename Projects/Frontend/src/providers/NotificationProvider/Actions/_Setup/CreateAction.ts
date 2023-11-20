import { ActionRegisterProps, HubActionNames } from "./HubActionTypes";

export default function CreateAction<Action extends HubActionNames>(
  action: Action,
  callback: ActionRegisterProps<Action>['callback'],
) {
  return {
    action,
    callback,
  };
}