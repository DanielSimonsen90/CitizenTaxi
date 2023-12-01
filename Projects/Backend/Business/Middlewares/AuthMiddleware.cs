using Business.Models;
using Business.Services;
using Microsoft.AspNetCore.Http;

namespace Business.Middlewares;

/// <summary>
/// Middleware for authenticating users.
/// </summary>
public class AuthMiddleware
{
    /// <summary>
    /// This method is called when the middleware is done processing the request.
    /// </summary>
    private readonly RequestDelegate _next;

    /// <summary>
    /// Service consisting of the main authentication process.
    /// </summary>
    private readonly AuthService _authService;

    public AuthMiddleware(RequestDelegate next, AuthService authService)
    {
        _next = next;
        _authService = authService;
    }

    /// <summary>
    /// This method is called when the middleware is invoked by ASP.NET Core.
    /// </summary>
    /// <param name="context">The relevant context to process the request</param>
    /// <returns></returns>
    /// <exception cref="Exception"></exception>
    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Path.HasValue) throw new Exception("Request path is null");

        // If user isn't re-authenticating or creating an account, check if they have valid tokens
        if (!context.Request.Path.Value.Contains("/users/authenticate") &&
            !(context.Request.Path.Value.Contains("/users") && context.Request.Method == "POST"))
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
