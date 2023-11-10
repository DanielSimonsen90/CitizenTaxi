using Common.Enums;
using System.Linq.Expressions;

namespace Common.Entities.User;

public class Citizen : AUser
{
    public static readonly Expression<Func<Citizen, object?>>[] RELATIONS = new Expression<Func<Citizen, object?>>[]
    {
        citizen => citizen.Note,
        citizen => citizen.Bookings,
    };
    public Citizen() : this("", Role.Citizen) { }
    public Citizen(string name, Role role) : base(name, role) {}

    public List<Booking> Bookings { get; set; } = new();
    public Note? Note { get; set; }
}
