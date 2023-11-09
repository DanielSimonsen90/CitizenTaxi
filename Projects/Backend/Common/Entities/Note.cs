using Common.Entities.User;
using Common.Enums;

namespace Common.Entities;

public class Note
{
    public Note(Citizen citizen, bool pensioner, string residence,
        CarHeight carHeight, HelpingUtil helpingUtil,
        Companion companion, Follow follow)
    {
        Citizen = citizen;
        Pensioner = pensioner;
        Residence = residence;
        CarHeight = carHeight;
        HelpingUtil = helpingUtil;
        Companion = companion;
        Follow = follow;
    }

    public Citizen Citizen { get; set; }
    public bool Pensioner { get; set; }
    public string Residence { get; set; }
    public CarHeight CarHeight { get; set; }
    public HelpingUtil HelpingUtil { get; set; }
    public Companion Companion { get; set; }
    public Follow Follow { get; set; }
}
