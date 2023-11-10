using System.ComponentModel.DataAnnotations;

namespace Common.Enums;

/// <summary>
/// Different follow options the citizen can choose from.
/// </summary>
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
