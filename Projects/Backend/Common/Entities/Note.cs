using Common.Entities.User;
using Common.Enums;
using DanhoLibrary.NLayer;
using System.ComponentModel.DataAnnotations.Schema;

namespace Common.Entities;

public class Note : BaseEntity<Guid>
{
    public Note() : this(false, "", CarHeight.Any, HelpingUtil.None, Companion.Alone, Follow.No) {}
    public Note(bool pensioner, string residence,
        CarHeight carHeight, HelpingUtil helpingUtil,
        Companion companion, Follow follow)
    {
        Pensioner = pensioner;
        Residence = residence;
        CarHeight = carHeight;
        HelpingUtil = helpingUtil;
        Companion = companion;
        Follow = follow;
    }

    [ForeignKey(nameof(Citizen))]
    public Guid CitizenId { get; set; }
    public Citizen Citizen { get; set; }

    public bool Pensioner { get; set; }
    public string Residence { get; set; }
    public CarHeight CarHeight { get; set; }
    public HelpingUtil HelpingUtil { get; set; }
    public Companion Companion { get; set; }
    public Follow Follow { get; set; }
}
