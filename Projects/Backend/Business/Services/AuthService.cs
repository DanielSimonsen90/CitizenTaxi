using Business.Models;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace Business.Services;

public class AuthService
{
    #region Statics
    /// <summary>
    /// This key is used to store the <see cref="AuthTokens"/> in cookies
    /// </summary>
    public const string COOKIE_KEY = "citizen_taxi_authentication";
    /// <summary>
    /// Configurable expiration times for access tokens
    /// </summary>
    public static readonly TimeSpan ACCESS_TOKEN_EXPIRATION = TimeSpan.FromMinutes(15);
    /// <summary>
    /// Configurable expiration times for refresh tokens
    /// </summary>
    public static readonly TimeSpan REFRESH_TOKEN_EXPIRATION = TimeSpan.FromDays(7);

    private static AuthToken GenerateToken(TimeSpan expiresIn)
    {
        string token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        DateTime expiresAt = DateTime.UtcNow.Add(expiresIn);

        return new AuthToken(token, expiresAt);
    }
    #endregion

    private readonly CacheService _cacheService;
    public AuthService(CacheService cacheService)
    {
        _cacheService = cacheService;
    }

    public void GenerateTokensAndSaveToCookies(Guid userId, HttpResponse response)
    {
        AuthTokens auth = new(
            access: GenerateToken(ACCESS_TOKEN_EXPIRATION),
            refresh: GenerateToken(REFRESH_TOKEN_EXPIRATION),
            userId: userId);

        AuthTokens? existing = _cacheService.AuthTokens.Values.FirstOrDefault(a => a.UserId == userId);
        if (existing != null) _cacheService.AuthTokens.Remove(existing.AccessToken.ToString());

        AddCookie(response, auth);
    }

    public void AddCookie(HttpResponse response, AuthTokens auth)
    {
        response.Cookies.Append(COOKIE_KEY,
            JsonSerializer.Serialize(auth,
                new JsonSerializerOptions()
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                }),
            new CookieOptions()
            {
                Expires = auth.AccessToken.ExpiresAt,
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Secure = true,
            });
        _cacheService.AuthTokens.Add(auth.AccessToken.ToString(), auth);
    }
    public AuthTokens? GetAuthTokens(HttpRequest request)
    {
        try
        {
            string cookie = request.Cookies[COOKIE_KEY];
            AuthTokens parsedCookie = JsonSerializer.Deserialize<AuthTokens>(cookie, new JsonSerializerOptions()
            {
                PropertyNameCaseInsensitive = true,
            }) ?? throw new Exception("Cookie is null");
            _cacheService.AuthTokens.TryGetValue(parsedCookie.AccessToken.Value, out AuthTokens? auth);
            return auth;
        }
        catch
        {
            return null;
        }
    }
    public void RemoveCookie(HttpRequest request, HttpResponse response)
    {
        AuthTokens? auth = GetAuthTokens(request);
        if (auth is null) return;

        response.Cookies.Delete(COOKIE_KEY);
        _cacheService.AuthTokens.Remove(auth.AccessToken.ToString());
    }

}
