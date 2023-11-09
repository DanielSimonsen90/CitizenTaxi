using Common.Entities.User;

namespace Common.Entities;

public class Login : DanhoLibrary.Login
{
    public Login(string username, string password, AUser user) : base(username, password)
    {
        User = user;
    }

    public AUser User { get; }
}
