type Actions = {
  login: [username: string, password: string];
  logout: [];
  sendMessage: [message: string];
  banUser: [username: string, reason?: string];
};

type ActionNames = keyof Actions;

function createAction<ActionName extends ActionNames>(
  actionName: ActionName,
  ...args: Actions[ActionName]
) {
  console.log(`[${actionName}]`, ...args);
}

createAction('logout');