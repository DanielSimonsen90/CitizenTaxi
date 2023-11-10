using Business.Services;
using Microsoft.AspNetCore.SignalR;

namespace Business.Hubs;

public class NotificationHub : Hub
{
    public const string ENDPOINT = "notificationhub";
    private readonly UnitOfWork _uow;

    public NotificationHub(UnitOfWork uow)
    {
        _uow = uow;
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
        // TODO: Stop simulation if user disconnects
        return base.OnDisconnectedAsync(exception);
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
