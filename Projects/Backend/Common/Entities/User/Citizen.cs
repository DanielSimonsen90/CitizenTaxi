using Common.Enums;

namespace Common.Entities.User;

public class Citizen : AUser
{
    public Citizen(string name, Role role) : base(name, role)
    {
    }

    public List<Booking> Bookings { get; set; } = new();
    public Note? Note { get; set; }
}
