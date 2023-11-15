#nullable disable

namespace Business.Models;

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
