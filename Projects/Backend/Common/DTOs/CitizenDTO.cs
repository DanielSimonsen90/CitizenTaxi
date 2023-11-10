#nullable disable

namespace Common.DTOs;

/// <summary>
/// DTO for <see cref="Citizen"/>.
/// This class extends <see cref="UserDTO"/> as <see cref="Entities.User.Citizen"/> extends <see cref="Entities.User.AUser"/> but includes more relations.
/// </summary>
public class CitizenDTO : UserDTO
{
    /// <summary>
    /// List of Bookings for the Citizen as a DTO to prevent circular references.
    /// </summary>
    public List<BookingDTO> Bookings { get; set; }
    /// <summary>
    /// List of Notes for the Citizen as a DTO to prevent circular references.
    /// </summary>
    public NoteDTO Note { get; set; }
}
