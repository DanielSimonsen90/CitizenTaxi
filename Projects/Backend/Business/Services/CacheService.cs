using Business.Helpers;
using Business.Models;
using Common.Entities;
using Common.Entities.User;
using DanhoLibrary.Extensions;

namespace Business.Services;

public class CacheService
{
    /// <summary>
    /// AuthTokens cache for <see cref="AuthService"/>"/>
    /// </summary>
    public readonly Dictionary<string, AuthTokens> AuthTokens = new(); // <access_token, Auth>

    /// <summary>
    /// LoginAttempts cache for <see cref="LoginService"/>"/>
    /// Key is username, value is attempts.
    /// This gets updated in <see cref="LoginService.TryLogin(Models.Payloads.LoginPayload)"/>
    /// </summary>
    public readonly Dictionary<string, LoginAttempt> LoginAttempts = new(); // <username, attempts>

    /// <summary>
    /// ConnectedUsers cache for <see cref="Hubs.NotificationHub"/>
    /// </summary>
    public readonly Dictionary<string, AUser> ConnectedUsers = new(); // <connectionId, user>

    /// <summary>
    /// Bookings cache consisting of all bookings for today
    /// </summary>
    public readonly BookingCache Bookings = new(); // <citizenId, bookings>
}
