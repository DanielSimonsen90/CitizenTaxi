namespace Business.Models.Payloads;

public class LoginPayload : DanhoLibrary.Login
{
    public LoginPayload(string username, string password) : base(username, password) {}
}
