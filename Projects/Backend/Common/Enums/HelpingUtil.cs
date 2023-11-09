using System.ComponentModel.DataAnnotations;

namespace Common.Enums;

public enum HelpingUtil
{
    [Display(Name = "Ingen")]
    None,

    [Display(Name = "Stok")]
    WalkingStick,

    [Display(Name = "Krykker")]
    Crutches,

    [Display(Name = "Rollator")]
    Rollator,

    [Display(Name = "Kørestol")]
    WheelChair,
}
