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
            !(context.Request.Path.Value.Contains("/users") && context.Request.Method == "POST") &&
            !context.Request.Path.Value.Contains("/users/ping"))
        {
            try
            {
                // Get the AuthTokens object from the cookies
                AuthTokens? auth = _authService.GetAuthTokens(context.Request);

                // If no tokens are found, or the access & refresh tokens are expired, throw Unauthorized
                if (auth is null || (auth.AccessToken.IsExpired && auth.RefreshToken.IsExpired)) throw new Exception("Unauthorized");
                // If access token is expired and refresh token is not, generate new tokens and save them to cookies
                if (auth.AccessToken.IsExpired) _authService.GenerateTokensAndSaveToCookies(auth.UserId, context.Response);
            }
            catch (Exception ex)
            {
                // Return 401 Unauthorized from the exception
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync(ex.Message);
                return;
            }
        }

        // Continue to the next middleware
        await _next(context);
    }
}
