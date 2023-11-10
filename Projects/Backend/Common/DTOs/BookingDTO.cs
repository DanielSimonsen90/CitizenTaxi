#nullable disable

namespace Common.DTOs;

public class BookingDTO : ABaseDTO
{
    public string Pickup { get; set; }
    public string Destination { get; set; }
    public DateTime Arrival { get; set; }
}
