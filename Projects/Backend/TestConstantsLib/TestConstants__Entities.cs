using Common.Entities.User;
using Common.Entities;
using Common.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestConstantsLib;

public static partial class TestConstants
{
    public static Citizen TEST_CITIZEN { get; } = new(CITIZEN_NAME);
    public static Note TEST_NOTE { get; } = new(
        pensioner: true,
        residence: RESIDENCE,
        carHeight: CarHeight.Low,
        helpingUtil: HelpingUtil.None,
        companion: Companion.Alone,
        follow: Follow.No);

    public static Booking TEST_BOOKING { get; } = new(
        pickup: RESIDENCE,
        destination: HOSTPITAL_FREDERIKSHAVN,
        arrival: DateTime.Now.AddHours(1))
    {
        Citizen = TEST_CITIZEN,
        CitizenId = TEST_CITIZEN.Id,
    };
}
