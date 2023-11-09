using System.ComponentModel.DataAnnotations;


namespace Common.Enums;

public enum Role
{
    [Display(Name = "Borger")]
    Citizen,

    [Display(Name = "Admin")]
    Admin,
}
