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

    /// <summary>
    /// Generates an <see cref="AuthToken"/> with a random token and expiration time
    /// </summary>
    /// <param name="expiresIn"><see cref="TimeSpan"/> of time until the <see cref="AuthToken"/> should expire</param>
    /// <returns></returns>
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

    /// <summary>
    /// Generates <see cref="AuthTokens"/> and saves them to cookies with key <see cref="COOKIE_KEY"/>
    /// </summary>
    /// <param name="userId">Id of the user to generate the tokens for</param>
    /// <param name="response">Response object to save the cookie</param>
    public void GenerateTokensAndSaveToCookies(Guid userId, HttpResponse response)
    {
        AuthTokens auth = new(
            access: GenerateToken(ACCESS_TOKEN_EXPIRATION),
            refresh: GenerateToken(REFRESH_TOKEN_EXPIRATION),
            userId: userId);

        // If existing tokens exists for this user, replace them
        AuthTokens? existing = _cacheService.AuthTokens.Values.FirstOrDefault(a => a.UserId == userId);
        if (existing is not null) _cacheService.AuthTokens.Remove(existing.AccessToken.ToString());

        AddCookie(response, auth);
    }

    /// <summary>
    /// Adds the <paramref name="auth"/> to the cookies with key <see cref="COOKIE_KEY"/>
    /// </summary>
    /// <param name="response">Response object to add the cookie</param>
    /// <param name="auth">Cookie value</param>
    public void AddCookie(HttpResponse response, AuthTokens auth)
    {
        response.Cookies.Append(COOKIE_KEY,
            JsonSerializer.Serialize(auth,
                new JsonSerializerOptions()
                {
                    // Force camelCase for cookie for frontend
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                }),
            new CookieOptions()
            {
                Expires = auth.AccessToken.ExpiresAt, // Set expiration time
                HttpOnly = true, // Only allow http access
                SameSite = SameSiteMode.None, // Allow cross-site cookies
                Secure = true, // Only allow https access
            });

        // Add the auth to the cache
        _cacheService.AuthTokens.Add(auth.AccessToken.ToString(), auth);
    }

    /// <summary>
    /// Get the <see cref="AuthTokens"/> from the cookies
    /// </summary>
    /// <param name="request">Request object that has the cookies</param>
    /// <returns>The found <see cref="AuthTokens"/>, if any</returns>
    public AuthTokens? GetAuthTokens(HttpRequest request)
    {
        try
        {
            string cookie = request.Cookies[COOKIE_KEY];
            AuthTokens parsedCookie = JsonSerializer.Deserialize<AuthTokens>(cookie, new JsonSerializerOptions()
            {
                // Map the camelCase cookie to PascalCase
                PropertyNameCaseInsensitive = true,
            }) ?? throw new Exception("Cookie is null");

            // Look for the auth in the cache
            _cacheService.AuthTokens.TryGetValue(parsedCookie.AccessToken.Value, out AuthTokens? auth);
            
            // Return the result
            return auth;
        }
        catch
        {
            // If the cookie is not found or invalid, return null
            return null;
        }
    }

    /// <summary>
    /// Removes the cookie with key <see cref="COOKIE_KEY"/> from the response
    /// </summary>
    /// <param name="request">Request object to get the <see cref="AuthToken"/> from cookie</param>
    /// <param name="response">Response object to remove the cookie</param>
    public void RemoveCookie(HttpRequest request, HttpResponse response)
    {
        // Get the auth from the cookie. If it doesn't exist, return
        AuthTokens? auth = GetAuthTokens(request);
        if (auth is null) return;

        // Remove the cookie from the cache and the response 
        response.Cookies.Delete(COOKIE_KEY);
        _cacheService.AuthTokens.Remove(auth.AccessToken.ToString());
    }
}
