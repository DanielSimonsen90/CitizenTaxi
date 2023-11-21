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

    public NotificationHub(UnitOfWork uow, CacheService cacheService)
    {
        _uow = uow;
        _cacheService = cacheService;

        BookingTimer.StartTimeout(() =>
        {
            OnDayChanged();
            return Task.CompletedTask;
        }, TimeSpan.FromDays(1));
        OnDayChanged();

        cacheService.Bookings.BookingUpsert += OnBookingUpserted;
    }

    /// <summary>
    /// When a client disconnects from the hub, stop the simulation.
    /// </summary>
    /// <param name="exception">The exception that may have caused the disconnect</param>
    /// <returns></returns>
    public override Task OnDisconnectedAsync(Exception? exception)
    {
        base.OnDisconnectedAsync(exception);

        // TODO: Stop simulation if user disconnects

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
        // Only send the notification to the client that called the method
        await Clients.Clients(connectionIds).SendAsync(HubEvents.NOTIFICATION, DateTime.Now, message); // [timestamp: DateTime, message: string]
        await SendLog("NOTIFICATION", message);
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

    /// <summary>
    /// When the day changes, reset the bookings cache and start a timer for each booking that will simulate the taxi arrival.
    /// </summary>
    private void OnDayChanged()
    {
        // Clear the cache
        _cacheService.Bookings.Clear();

        // Get all bookings that are after now but before tomorrow
        IEnumerable<Booking> bookings = _uow.Bookings.GetAll()
            .Where(b => b.Arrival.Date == DateTime.Now.Date);

        foreach (Booking booking in bookings)
        {
            var bookingsCache = _cacheService.Bookings;
            Guid key = booking.CitizenId;

            // Add the bookings to the cache
            bookingsCache.Set(key, bookingsCache.ContainsKey(key)
                ? bookingsCache[key].Append(booking)
                : new List<Booking> { booking });

            // Start a timer for the booking that will simulate the taxi arrival
            OnBookingUpserted(key, booking);
        }
    }

    public void OnBookingUpserted(Guid citizenId, Booking booking)
    {
        if (booking.Arrival.Date != DateTime.Now.Date) return;

        TimeSpan timeout = booking.Arrival - DateTime.Now;
        if (timeout > TimeSpan.Zero) BookingTimer.StartTimeout(
            async () => await Simulate(booking), 
            timeout.Minutes >= 5 
                ? timeout.Subtract(TimeSpan.FromMinutes(5)) 
                : timeout);
    }

    /// <summary>
    /// Simulate a taxi order for the given <paramref name="booking"/>.
    /// </summary>
    /// <param name="booking">The booking to simulate</param>
    /// <returns></returns>
    private async Task Simulate(Booking booking)
    {
        await OnTaxiTimeUpdated(booking, TimeSpan.FromHours(1));

        //int[] minutes = { 15, 10, 5, 5 };
        int[] minutes = { 1, 1, 1, 1 };
        for (int i = 0; i < minutes.Length; i++)
        {
            Thread.Sleep(TimeSpan.FromMinutes(minutes[i]).Milliseconds);

            if (_cacheService.Bookings.ContainsKey(booking.CitizenId) 
                && !_cacheService.Bookings[booking.CitizenId].Contains(booking)) 
                return; // If the booking is no longer in the cache, return

            if (i != minutes.Length - 1) await OnTaxiTimeUpdated(booking, TimeSpan.FromMinutes(minutes[i]));
            else await OnTaxiTimeUpdated(booking, TimeSpan.Zero);
        }

        _cacheService.Bookings.RaiseBookingDeleteEvent(booking.Id);
    }

    /// <summary>
    /// Simualte a taxi order for the given <paramref name="bookingId"/>.
    /// </summary>
    /// <param name="bookingId">Id of the <see cref="Common.Entities.Booking"/> that should be simulated</param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    private async Task OnTaxiTimeUpdated(Booking booking, TimeSpan timeLeft)
    {
        string[] connectionIds = _cacheService.ConnectedUsers
            .Where(kvp => kvp.Value is Citizen citizen && citizen.Id == booking.CitizenId)
            .Select(kvp => kvp.Key)
            .ToArray();

        if (!connectionIds.Any()) return;
        if (timeLeft != TimeSpan.Zero)
        {
            string timeMessage = timeLeft.Hours > 0 ? $"{timeLeft.Hours} time" : $"{timeLeft.Minutes} minutter";
            await SendNotification($"Der er nu {timeMessage} tilbage til at din taxa ankommer.", connectionIds);
        }
        else await SendNotification("Din taxa er nu ankommet.", connectionIds);
    }
    #endregion
}
