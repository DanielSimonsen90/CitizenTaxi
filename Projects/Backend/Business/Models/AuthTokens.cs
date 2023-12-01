#nullable disable

namespace Business.Models;

/// <summary>
/// Contains the access and refresh token, as well as the user id.
/// This should be stored in the cookies under <see cref="Services.AuthService.COOKIE_KEY"/>
/// </summary>
public class AuthTokens
{
    public AuthTokens() {} // For deserialization
    public AuthTokens(AuthToken access, AuthToken refresh, Guid userId)
    {
        AccessToken = access;
        RefreshToken = refresh;
        UserId = userId;
    }

    public AuthToken AccessToken { get; set; }
    public AuthToken RefreshToken { get; set; }
    public Guid UserId { get; set; }
}
