import CreateEvent from "./_Setup/CreateEvent";

export default CreateEvent('error', async ({ addNotification, args: [message] }) => {
  alert(message);
  console.error(message);

  addNotification({
    message,
    timestamp: new Date()
  });
});