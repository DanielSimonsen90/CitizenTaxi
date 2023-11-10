using Common.Entities.User;
using DanhoLibrary.NLayer;

namespace Common.Entities;

public class Login : BaseEntity<Guid>
{
    public Login(string username, string password, AUser user)
    {
        User = user;
        Username = username;
        Password = password;
    }

    public string Username { get; set; }
    public string Password { get; set; }
    public AUser User { get; }
}
