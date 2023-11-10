#nullable disable

using Common.Enums;

namespace Common.DTOs;

/// <summary>
/// DTO for <see cref="Common.Entities.User.AUser"/>.
/// This class is primarily used as an "AdminDTO".
/// This class extends <see cref="ABaseDTO"/> to ensure that the DTO may have an Id for PUT requests.
/// </summary>
public class UserDTO : ABaseDTO
{
    public string Name { get; set; }
    public Role Role { get; set; }
}
