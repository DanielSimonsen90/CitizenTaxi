#nullable disable

namespace Common.DTOs;

/// <summary>
/// DTO for <see cref="Booking"/>.
/// This class extends <see cref="ABaseDTO"/> to ensure that the DTO may have an Id for PUT requests.
/// </summary>
public class BookingDTO : ABaseDTO
{
    public string Pickup { get; set; }
    public string Destination { get; set; }
    public DateTime Arrival { get; set; }
}
