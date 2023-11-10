using Business.Services;
using Microsoft.AspNetCore.SignalR;

namespace Business.Hubs;

public class NotificationHub : Hub
{
    /// <summary>
    /// Endpoint for the API.
    /// </summary>
    public const string ENDPOINT = "notificationhub";
    private readonly UnitOfWork _uow;

    public NotificationHub(UnitOfWork uow)
    {
        _uow = uow;
    }

    /// <summary>
    /// When a client disconnects from the hub, stop the simulation.
    /// </summary>
    /// <param name="exception">The exception that may have caused the disconnect</param>
    /// <returns></returns>
    public override Task OnDisconnectedAsync(Exception? exception)
    {
        // TODO: Stop simulation if user disconnects
        return base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Simualte a taxi order for the given <paramref name="bookingId"/>.
    /// </summary>
    /// <param name="bookingId">Id of the <see cref="Common.Entities.Booking"/> that should be simulated</param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    public Task Simulate(Guid bookingId)
    {
        throw new NotImplementedException();
    }

    /// <summary>
    /// Send a notification to the client.
    /// </summary>
    /// <param name="message">The message to send</param>
    /// <returns></returns>
    private async Task SendNotification(string message)
    {
        // Only send the notification to the client that called the method
        await Clients.Caller.SendAsync(HubEvents.NOTIFICATION, DateTime.Now, message); // [timestamp: DateTime, message: string]
    }

    /// <summary>
    /// Log a message to the client.
    /// </summary>
    /// <param name="type">Type of log. Sending or Receiving</param>
    /// <param name="message">Message of the log</param>
    /// <returns></returns>
    private async Task Log(string type, string message)
    {
        // Only send the log to the client that called the method
        await Clients.Caller.SendAsync(HubEvents.LOG, DateTime.Now, 
            $"[{type}] {message}"); // [timestamp: DateTime, message: string]
    }
}
