using Common.Enums;
using DanhoLibrary.NLayer;
using System.Linq.Expressions;

namespace Common.Entities.User;

/// <summary>
/// Abstract class for all users.
/// The class extends <see cref="BaseEntity{TKey}"/> with a <see cref="Guid"/> as the primary key.
/// <see cref="BaseEntity{TId}"/> is a class from my external library, DanhoLibrary.NLayer, that ensures a TId Id for Primary key.
/// The primary key for this a <see cref="Guid"/> because it is the most flexible primary key.
/// </summary>
public abstract class AUser : BaseEntity<Guid>
{
    //public static readonly Expression<Func<AUser, object?>>[] RELATIONS =
    //{
    //    user => user.Login
    //};

    public AUser(string name, Role role)
    {
        Name = name;
        Role = role;
    }

    public string Name { get; set; }
    public Role Role { get; set; }

    // Nullable disabled because the Login property is not required to create a user, but it is required in the database.
#nullable disable
    public Login Login { get; set; }
}
