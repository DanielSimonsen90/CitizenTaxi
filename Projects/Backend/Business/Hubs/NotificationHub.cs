using Business.Services;
using Microsoft.AspNet.SignalR;

namespace Business.Hubs;

public class NotificationHub : Hub
{
    private readonly UnitOfWork _uow;

    public NotificationHub(UnitOfWork uow)
    {
        _uow = uow;
    }

    public override Task OnDisconnected(bool stopCalled)
    {
        return base.OnDisconnected(stopCalled);
        // TODO: Stop simulation if user disconnects
    }

    public Task Simulate(Guid bookingId)
    {
        throw new NotImplementedException();
    }

    private async Task SendNotification(string message)
    {
        await Clients.Caller.SendAsync(HubEvents.NOTIFICATION, DateTime.Now, message); // [timestamp: DateTime, message: string]
    }
    private async Task Log(string type, string message)
    {
        await Clients.Caller.SendAsync(HubEvents.LOG, DateTime.Now, 
            $"[{type}] {message}"); // [timestamp: DateTime, message: string]
    }
}
