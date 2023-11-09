using System.ComponentModel.DataAnnotations;

namespace Common.Enums;

public enum Follow
{
    [Display(Name = "Nej")]
    No,

    [Display(Name = "Ved destination")]
    AtDestination,

    [Display(Name = "Ved afhentning")]
    AtPickup,

    [Display(Name = "Begge")]
    Both
}
