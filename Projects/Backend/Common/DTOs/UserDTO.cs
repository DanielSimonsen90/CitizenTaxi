#nullable disable

using Common.Enums;

namespace Common.DTOs;

public class UserDTO : ABaseDTO
{
    public string Name { get; set; }
    public Role Role { get; set; }
}
