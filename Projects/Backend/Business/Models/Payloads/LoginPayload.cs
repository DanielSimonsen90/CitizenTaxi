#nullable disable
namespace Business.Models.Payloads;

public class LoginPayload : ABaseModifyPayload
{
    public string Username { get; set; }
    public string Password { get; set; }
}
