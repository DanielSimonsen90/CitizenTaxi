#nullable disable
using Common.Enums;

namespace Business.Models.Payloads;

public class NoteModifyPayload
{
    public Guid CitizenId { get; set; }
    public bool Pensioner { get; set; }
    public string Residence { get; set; }
    public CarHeight CarHeight { get; set; }
    public HelpingUtil HelpingUtil { get; set; }
    public Companion Companion { get; set; }
    public Follow Follow { get; set; }
}
