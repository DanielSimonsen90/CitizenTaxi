using Business.Helpers;
using Business.Models;
using Business.Services;
using Common.Entities;
using Common.Entities.User;
using DanhoLibrary.Extensions;
using DanhoLibrary.NLayer;
using Microsoft.AspNetCore.SignalR;

namespace Business.Hubs;

public class NotificationHub : Hub
{
    /// <summary>
    /// Endpoint for the API.
    /// </summary>
    public const string ENDPOINT = "notificationhub";
    private readonly UnitOfWork _uow;
    private readonly CacheService _cacheService;
    private readonly NotificationService _notificationService;

    public NotificationHub(UnitOfWork uow, CacheService cacheService, NotificationService notificationService)
    {
        _uow = uow;
        _cacheService = cacheService;
        _notificationService = notificationService;
        _notificationService.Reset(uow, SendNotification);
    }

    /// <summary>
    /// When a client disconnects from the hub, stop the simulation.
    /// </summary>
    /// <param name="exception">The exception that may have caused the disconnect</param>
    /// <returns></returns>
    public override Task OnDisconnectedAsync(Exception? exception)
    {
        base.OnDisconnectedAsync(exception);

        _cacheService.ConnectedUsers.Remove(Context.ConnectionId);
        return Task.CompletedTask;
    }

    #region HubActions
    /// <summary>
    /// Registers <see cref="AUser"/> object to the hub.
    /// This is used so the client/citizen can receive notifications when the latest taxi "is on the way".
    /// </summary>
    /// <param name="accessToken">The access token of the user</param>
    /// <param name="citizenId">The id of the citizen</param>
    /// <returns></returns>
    public Task Subscribe(string accessToken, Guid citizenId)
    {
        AuthTokens? authTokens = _cacheService.AuthTokens[accessToken];
        if (authTokens is null) return SendError("Invalid access token.");

        AUser? user = TryGetUser(authTokens.UserId);
        if (user is null) return SendError($"User with id {authTokens.UserId} not found.");
        if (user is Citizen && user.Id != citizenId) return SendError("Unauthorized.");
        if (!_uow.Citizens.Exists(citizenId)) return SendError($"Citizen with id {citizenId} not found.");

        _cacheService.ConnectedUsers.Set(Context.ConnectionId, user);

        return SendNotification($"Du er nu tilmeldt notifikationer med id: {Context.ConnectionId}.", new[] { Context.ConnectionId });
    }
    public Task Ping() => SendNotification($"Pong! - {Context.ConnectionId}", new[] { Context.ConnectionId });
    #endregion

    #region HubEvents
    /// <summary>
    /// Send a notification to the client.
    /// </summary>
    /// <param name="message">The message to send</param>
    /// <returns></returns>
    private async Task SendNotification(string message, string[] connectionIds)
    {
        try
        {
            // Only send the notification to the client that called the method
            await Clients.Clients(connectionIds).SendAsync(HubEvents.NOTIFICATION, DateTime.Now, message); // [timestamp: DateTime, message: string]
            await SendLog("NOTIFICATION", message);
        }
        catch (Exception ex)
        {
            await SendError(ex.ToString());
        }
    }
    /// <summary>
    /// Log a message to the client.
    /// </summary>
    /// <param name="type">Type of log. Sending or Receiving</param>
    /// <param name="message">Message of the log</param>
    /// <returns></returns>
    private async Task SendLog(string type, string message)
    {
        // Only send the log to the client that called the method
        await Clients.Caller.SendAsync(HubEvents.LOG, DateTime.Now, type , message); // [timestamp: DateTime, type: string, message: string]
    }
    /// <summary>
    /// Send an error message to the client
    /// </summary>
    /// <param name="message">Message to send</param>
    private async Task SendError(string message)
    {
        await Clients.Caller.SendAsync(HubEvents.ERROR, message); // [message: string]
        await SendLog("ERROR", message);
    }
    #endregion

    #region Internal
    /// <summary>
    /// Queries citizens for <paramref name="userId"/> and if fail, queries admins. Ultimately returns null if no user is found.
    /// </summary>
    /// <param name="userId">Id of the user to find</param>
    /// <returns>User if any</returns>
    private AUser? TryGetUser(Guid userId)
    {
        try { return _uow.Citizens.Get(userId); }
        catch (EntityNotFoundException<Citizen, Guid>)
        {
            try { return _uow.Admins.Get(userId); }
            catch (EntityNotFoundException<Admin, Guid>) { return null; }
        }
    }
    #endregion
}
