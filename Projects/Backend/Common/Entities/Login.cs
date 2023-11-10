using Common.Entities.User;
using DanhoLibrary.NLayer;
using System.ComponentModel.DataAnnotations.Schema;

namespace Common.Entities;

public class Login : BaseEntity<Guid>
{
    public Login() : this("", "", new Citizen()) {}
    public Login(string username, string password, AUser user)
    {
        User = user;
        Username = username;
        Password = password;
    }

    public string Username { get; set; }
    public string Password { get; set; }

    [ForeignKey(nameof(User))]
    public Guid UserId { get; set; }
    public AUser User { get; }
}
