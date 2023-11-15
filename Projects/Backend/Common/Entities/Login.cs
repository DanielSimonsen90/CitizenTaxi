using Common.Entities.User;
using DanhoLibrary.NLayer;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq.Expressions;

namespace Common.Entities;

/// <summary>
/// Login entity for <see cref="AUser"/>.
/// The class extends <see cref="BaseEntity{TKey}"/> with a <see cref="Guid"/> as the primary key.
/// <see cref="BaseEntity{TId}"/> is a class from my external library, DanhoLibrary.NLayer, that ensures a TId Id for Primary key.
/// The primary key for this a <see cref="Guid"/> because it is the most flexible primary key.
/// </summary>
public class Login : BaseEntity<Guid>
{
    // Overloading constructor to satisfy EntityFramework in creating models using Migrations.
    public Login() : this("", "", "", new Citizen()) {}
    public Login(string username, string password, string salt, AUser user)
    {
        User = user;
        UserId = user.Id;
        Username = username;
        Password = password;
        Salt = salt;
    }

    public string Username { get; set; }
    public string Password { get; set; }
    public string Salt { get; set; }

    // Defining foreign key relationship to AUser (Citizen or Admin).
    [ForeignKey(nameof(User))]
    public Guid UserId { get; set; }
    public AUser User { get; }
}
