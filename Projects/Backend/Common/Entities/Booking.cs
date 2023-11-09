using Common.Entities.User;

namespace Common.Entities;

public class Booking
{
    public Booking(string pickup, string destination, DateTime arrival, Citizen citizen)
    {
        Pickup = pickup;
        Destination = destination;
        Arrival = arrival;
        Citizen = citizen;
    }

    public string Pickup { get; set; }
    public string Destination { get; set; }
    public DateTime Arrival { get; set; }

    public Citizen Citizen { get; set; }
}
