#nullable disable
using Common.Enums;

namespace Business.Models.Payloads;

/// <summary>
/// ModifyPayload for <see cref="Common.Entities.Note"/>.
/// This extends <see cref="ABaseModifyPayload"/> to ensure that the DTO may have an Id for PUT requests.
/// This also excludes <see cref="Common.Entities.Note.Citizen"/> from the payload, as <see cref="Common.Entities.Note.Citizen"/> is a relation and not part of the entity.
/// </summary>
public class NoteModifyPayload : ABaseModifyPayload
{
    public Guid CitizenId { get; set; }
    public bool Pensioner { get; set; }
    public string Residence { get; set; }
    public CarHeight CarHeight { get; set; }
    public HelpingUtil HelpingUtil { get; set; }
    public Companion Companion { get; set; }
    public Follow Follow { get; set; }
}
