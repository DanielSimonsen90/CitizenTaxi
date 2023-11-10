#nullable disable
namespace Business.Models.Payloads;

/// <summary>
/// Payload for <see cref="Common.Entities.Login"/>
/// This class extends <see cref="ABaseModifyPayload"/> to ensure that the DTO may have an Id for PUT requests.
/// This also excludes <see cref="Common.Entities.Login.User"/> from the payload, as <see cref="Common.Entities.Login.User"/> is a relation and not part of the entity.
/// </summary>
public class LoginPayload : ABaseModifyPayload
{
    public string Username { get; set; }
    public string Password { get; set; }
}
