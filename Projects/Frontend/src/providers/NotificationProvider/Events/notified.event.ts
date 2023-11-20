import CreateEvent from "./_Setup/CreateEvent";

export default CreateEvent('notified', async ({ addNotification, args: [timestamp, message] }) => {
  addNotification({
    message,
    timestamp: new Date(timestamp)
  });
});