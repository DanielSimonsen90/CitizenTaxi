#nullable disable
namespace Business.Models.Payloads;

/// <summary>
/// ModifyPayload for <see cref="Common.Entities.Booking"/>.
/// This class extends <see cref="ABaseModifyPayload"/> to ensure that the DTO may have an Id for PUT requests.
/// This also excludes <see cref="Common.Entities.Booking.Citizen"/> from the payload, as <see cref="Common.Entities.Booking.Citizen"/> is a relation and not part of the entity.
/// </summary>
public class BookingModifyPayload : ABaseModifyPayload
{
    public Guid CitizenId { get; set; }
    public string Pickup { get; set; }
    public string Destination { get; set; }
    public DateTime Arrival { get; set; }
}
