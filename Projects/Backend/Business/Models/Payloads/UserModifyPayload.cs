#nullable disable

namespace Business.Models.Payloads;

public class UserModifyPayload
{
    public string Name { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }

    public string? Email { get; set; }
}
