using Common.Enums;
using System.Linq.Expressions;

namespace Common.Entities.User;

public class Citizen : AUser
{
    /// <summary>
    /// Relations to include when getting a citizen from the database.
    /// </summary>
    public static readonly Expression<Func<Citizen, object?>>[] RELATIONS = new Expression<Func<Citizen, object?>>[]
    {
        citizen => citizen.Login,
        citizen => citizen.Note,
        citizen => citizen.Bookings,
    };

    // Overloading constructor to satisfy EntityFramework in creating models using Migrations.
    public Citizen() : this(string.Empty) { }
    public Citizen(string name) : base(name, Role.Citizen) {}

    // Related database entities.
    public List<Booking> Bookings { get; set; } = new();
    public Note? Note { get; set; }
}
