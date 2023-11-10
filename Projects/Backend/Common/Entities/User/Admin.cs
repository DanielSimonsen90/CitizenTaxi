using Common.Enums;

namespace Common.Entities.User;

public class Admin : AUser
{
    public Admin() : this("", Role.Admin) {}
    public Admin(string name, Role role) : base(name, role)
    {
    }
}
