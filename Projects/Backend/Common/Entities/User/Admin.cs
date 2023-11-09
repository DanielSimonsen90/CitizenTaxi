using Common.Enums;

namespace Common.Entities.User;

public class Admin : AUser
{
    public Admin(string name, Role role) : base(name, role)
    {
    }
}
