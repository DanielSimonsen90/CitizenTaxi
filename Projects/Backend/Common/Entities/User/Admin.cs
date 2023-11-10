using Common.Enums;

namespace Common.Entities.User;

/// <summary>
/// Admin user extending <see cref="AUser"/>.
/// </summary>
public class Admin : AUser
{
    // Overloading constructor to satisfy EntityFramework in creating models using Migrations.
    public Admin() : this("", Role.Admin) {}
    public Admin(string name, Role role) : base(name, role) {}
}
