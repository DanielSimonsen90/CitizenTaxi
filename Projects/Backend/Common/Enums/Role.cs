using System.ComponentModel.DataAnnotations;


namespace Common.Enums;

/// <summary>
/// System roles.
/// </summary>
public enum Role
{
    [Display(Name = "Borger")]
    Citizen,

    [Display(Name = "Admin")]
    Admin,
}
