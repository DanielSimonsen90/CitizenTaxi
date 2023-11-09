#nullable disable

namespace Common.DTOs;

public class CitizenDTO : UserDTO
{
    public List<BookingDTO> Bookings { get; set; }
    public NoteDTO Note { get; set; }
}
