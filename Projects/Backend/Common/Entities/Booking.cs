using Common.Entities.User;
using DanhoLibrary.NLayer;
using System.ComponentModel.DataAnnotations.Schema;

namespace Common.Entities;

public class Booking : BaseEntity<Guid>
{
    public Booking() : this("", "", DateTime.Now) { }
    public Booking(string pickup, string destination, DateTime arrival)
    {
        Pickup = pickup;
        Destination = destination;
        Arrival = arrival;
    }

    public string Pickup { get; set; }
    public string Destination { get; set; }
    public DateTime Arrival { get; set; }

    [ForeignKey(nameof(Citizen))]
    public Guid CitizenId { get; set; }
    public Citizen Citizen { get; set; }
}
