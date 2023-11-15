using Business.Models;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace Business.Services;

public class AuthService
{
    #region Statics
    public const string COOKIE_KEY = "citizen_taxi_authentication";
    public static readonly TimeSpan ACCESS_TOKEN_EXPIRATION = TimeSpan.FromMinutes(15);
    public static readonly TimeSpan REFRESH_TOKEN_EXPIRATION = TimeSpan.FromDays(7);

    protected static readonly Dictionary<string, AuthTokens> authTokens = new(); // <access_token, Auth>

    public static void GenerateTokensAndSaveToCookies(Guid userId, HttpResponse response)
    {
        AuthTokens auth = new(
            access: GenerateToken(ACCESS_TOKEN_EXPIRATION),
            refresh: GenerateToken(REFRESH_TOKEN_EXPIRATION),
            userId: userId);

        AuthTokens? existing = authTokens.Values.FirstOrDefault(a => a.UserId == userId);
        if (existing != null) authTokens.Remove(existing.AccessToken.ToString());

        AddCookie(response, auth);
    }

    public static void AddCookie(HttpResponse response, AuthTokens auth)
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
        authTokens.Add(auth.AccessToken.ToString(), auth);
    }
    public static AuthTokens? GetAuthTokens(HttpRequest request)
    {
        try
        {
            string cookie = request.Cookies[COOKIE_KEY];
            AuthTokens parsedCookie = JsonSerializer.Deserialize<AuthTokens>(cookie, new JsonSerializerOptions()
            {
                PropertyNameCaseInsensitive = true,
            }) ?? throw new Exception("Cookie is null");
            authTokens.TryGetValue(parsedCookie.AccessToken.Value, out AuthTokens? auth);
            return auth;
        }
        catch
        {
            return null;
        }
    }
    public static void RemoveCookie(HttpRequest request, HttpResponse response)
    {
        AuthTokens? auth = GetAuthTokens(request);
        if (auth is null) return;
            
        response.Cookies.Delete(COOKIE_KEY);
        authTokens.Remove(auth.AccessToken.ToString());
    }

    private static AuthToken GenerateToken(TimeSpan expiresIn)
    {
        string token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        DateTime expiresAt = DateTime.UtcNow.Add(expiresIn);

        return new AuthToken(token, expiresAt);
    }
    #endregion

    private readonly RequestDelegate _next;
    public AuthService(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Path.HasValue) throw new Exception("Request path is null");
        if (!context.Request.Path.Value.Contains("/users/authenticate"))
        {
            try
            {
                AuthTokens? auth = GetAuthTokens(context.Request);

                if (auth is null || (auth.AccessToken.IsExpired && auth.RefreshToken.IsExpired)) throw new Exception("Unauthorized");
                if (auth.AccessToken.IsExpired) GenerateTokensAndSaveToCookies(auth.UserId, context.Response);
            }
            catch (Exception)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Invalid tokens");
                return;
            }
        }

        await _next(context);
    }
}
