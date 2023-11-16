using Business.Models;
using Business.Services;
using Microsoft.AspNetCore.Http;

namespace Business.Middlewares;

public class AuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly AuthService _authService;

    public AuthMiddleware(RequestDelegate next, AuthService authService)
    {
        _next = next;
        _authService = authService;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Path.HasValue) throw new Exception("Request path is null");

        // If user isn't re-authenticating or creating an account, check if they have valid tokens
        if (!context.Request.Path.Value.Contains("/users/authenticate") &&
            !(context.Request.Path.Value.Contains("/users") && context.Request.Method == "POST"))
        {
            try
            {
                AuthTokens? auth = _authService.GetAuthTokens(context.Request);

                if (auth is null || (auth.AccessToken.IsExpired && auth.RefreshToken.IsExpired)) throw new Exception("Unauthorized");
                if (auth.AccessToken.IsExpired) _authService.GenerateTokensAndSaveToCookies(auth.UserId, context.Response);
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
