using Common.Enums;
using System.Linq.Expressions;

namespace Common.Entities.User;

/// <summary>
/// Admin user extending <see cref="AUser"/>.
/// </summary>
public class Admin : AUser
{
    public static readonly Expression<Func<Admin, object?>>[] RELATIONS =
    {
        admin => admin.Login
    };

    // Overloading constructor to satisfy EntityFramework in creating models using Migrations.
    public Admin() : this(string.Empty) {}
    public Admin(string name) : base(name, Role.Admin) {}
}
