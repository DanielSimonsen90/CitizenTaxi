using Common.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace Common.Entities.User;

public class Citizen : AUser
{
    public Citizen() : this("", Role.Citizen) { }
    public Citizen(string name, Role role) : base(name, role) {}

    public List<Booking> Bookings { get; set; } = new();
    public Note? Note { get; set; }
}
