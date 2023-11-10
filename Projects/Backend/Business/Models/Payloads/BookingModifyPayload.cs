#nullable disable
namespace Business.Models.Payloads;

public class BookingModifyPayload
{
    public Guid CitizenId { get; set; }
    public string Pickup { get; set; }
    public string Destination { get; set; }
    public DateTime Arrival { get; set; }
}
