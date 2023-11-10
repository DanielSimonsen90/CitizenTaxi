#nullable disable

using Common.Enums;

namespace Common.DTOs;

/// <summary>
/// DTO for <see cref="Note"/>.
/// This class extends <see cref="ABaseDTO"/> to ensure that the DTO may have an Id for PUT requests.
/// </summary>
public class NoteDTO : ABaseDTO
{
    public bool Pensioner { get; set; }
    public string Residence { get; set; }
    public CarHeight CarHeight { get; set; }
    public HelpingUtil HelpingUtil { get; set; }
    public Companion Companion { get; set; }
    public Follow Follow { get; set; }
}
