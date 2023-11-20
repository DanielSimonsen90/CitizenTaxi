import CreateAction from "./_Setup/CreateAction";

export default CreateAction('subscribe', async ({ authTokens, citizen, broadcast }) => {
  broadcast(authTokens.accessToken.value, citizen.id);
});