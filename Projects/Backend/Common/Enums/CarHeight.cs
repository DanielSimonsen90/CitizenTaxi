using System.ComponentModel.DataAnnotations;

namespace Common.Enums;

public enum CarHeight
{
    [Display(Name = "Enhver")]
    Any,

    [Display(Name = "Lav")]
    Low,

    [Display(Name = "Høj")]
    High,
}
