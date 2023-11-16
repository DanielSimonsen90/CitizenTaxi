using Business.Models;

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
    /// This gets updated in <see cref="TryLogin(LoginPayload)"/>
    /// </summary>
    public readonly Dictionary<string, LoginAttempt> LoginAttempts = new(); // <username, attempts>
}
