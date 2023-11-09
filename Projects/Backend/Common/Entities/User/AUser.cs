using Common.Enums;
using DanhoLibrary.NLayer;

namespace Common.Entities.User;

public abstract class AUser : BaseEntity<Guid>
{
    public AUser(string name, Role role)
    {
        Name = name;
        Role = role;
    }

    public string Name { get; set; }
    public Role Role { get; set; }

#nullable disable
    public Login Login { get; set; }
}
