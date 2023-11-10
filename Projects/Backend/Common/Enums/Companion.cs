﻿using System.ComponentModel.DataAnnotations;

namespace Common.Enums;

public enum Companion
{
    [Display(Name = "Alene")]
    Alone,

    [Display(Name = "Med pårørende")]
    WithRelative,

    [Display(Name = "Med hjælper")]
    WithHelper,

    [Display(Name = "Med ledsager")]
    WithCompanion,

    [Display(Name = "Med guide")]
    WithGuide,

    [Display(Name = "Med kæledyr")]
    WithPet,

    [Display(Name = "Med barn")]
    WithChild,
}