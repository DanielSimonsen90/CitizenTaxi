#nullable disable

using Common.Enums;

namespace Business.Models.Payloads;

public class UserModifyPayload : ABaseModifyPayload
{
    public string Name { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public Role Role { get; set; }

    public string? Email { get; set; }
}
