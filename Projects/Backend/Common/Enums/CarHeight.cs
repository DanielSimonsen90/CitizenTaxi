using System.ComponentModel.DataAnnotations;

namespace Common.Enums;

/// <summary>
/// Different car heights the citizen can choose from.
/// </summary>
public enum CarHeight
{
    [Display(Name = "Enhver")]
    Any,

    [Display(Name = "Lav")]
    Low,

    [Display(Name = "Høj")]
    High,
}
