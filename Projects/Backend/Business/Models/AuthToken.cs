using System.Text.Json.Serialization;

namespace Business.Models;

public class AuthToken
{
    public AuthToken(string value, DateTime expiresAt)
    {
        Value = value;
        ExpiresAt = expiresAt;
    }

    public string Value { get; set; }
    public DateTime ExpiresAt { get; set; }
    [JsonIgnore]
    public bool IsExpired => DateTime.UtcNow > ExpiresAt;

    public new string ToString() => Value;
}
