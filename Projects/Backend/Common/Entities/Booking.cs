using Common.Entities.User;
using DanhoLibrary.NLayer;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq.Expressions;

namespace Common.Entities;

/// <summary>
/// Taxi booking for <see cref="Citizen"/>.
/// The class extends <see cref="BaseEntity{TKey}"/> with a <see cref="Guid"/> as the primary key.
/// <see cref="BaseEntity{TId}"/> is a class from my external library, DanhoLibrary.NLayer, that ensures a TId Id for Primary key.
/// The primary key for this a <see cref="Guid"/> because it is the most flexible primary key.
/// </summary>
public class Booking : BaseEntity<Guid>
{
    /// <summary>
    /// Relations to include when getting a booking from the database.
    /// </summary>
    public static readonly Expression<Func<Booking, object?>>[] RELATIONS = 
    { 
        booking => booking.Citizen 
    };

    // Overloading constructor to satisfy EntityFramework in creating models using Migrations.
    public Booking() : this("", "", DateTime.Now) { }
    // Ignoring Citizen instanciation because it is not required to create a booking, but it is required in the database.
    public Booking(string pickup, string destination, DateTime arrival)
    {
        Pickup = pickup;
        Destination = destination;
        Arrival = arrival;
    }

    public string Pickup { get; set; }
    public string Destination { get; set; }
    public DateTime Arrival { get; set; }

    // Defining foreign key relationship to Citizen.
    [ForeignKey(nameof(Citizen))]
    public Guid CitizenId { get; set; }
    public Citizen Citizen { get; set; }
}
