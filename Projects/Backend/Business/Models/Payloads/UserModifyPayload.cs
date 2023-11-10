#nullable disable

using Common.Enums;

namespace Business.Models.Payloads;

/// <summary>
/// ModifyPayload for <see cref="Common.Entities.User.Citizen"/> and <see cref="Common.Entities.User.Admin"/>.
/// This class extends <see cref="ABaseModifyPayload"/> to ensure that the DTO may have an Id for PUT requests.
/// This also excludes <see cref="Common.Entities.User.AUser.Login"/> from the payload, as <see cref="Common.Entities.User.AUser.Login"/> is a relation and not part of the entity.
/// Includes nullable <see cref="Email"/> property for the <see cref="Common.Entities.User.Citizen"/> model.
/// </summary>
public class UserModifyPayload : ABaseModifyPayload
{
    public string Name { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public Role Role { get; set; }

    public string? Email { get; set; }
}
