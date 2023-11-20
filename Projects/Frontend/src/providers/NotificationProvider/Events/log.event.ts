import CreateEvent from "./_Setup/CreateEvent";

export default CreateEvent('log', async ({ addLog, args: [timestamp, type, message] }) => {
  addLog({
    message,
    timestamp: new Date(timestamp),
    type,
  });
});
