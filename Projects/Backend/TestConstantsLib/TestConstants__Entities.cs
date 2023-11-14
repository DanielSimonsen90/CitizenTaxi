using Common.Entities;
using Common.Entities.User;
using Common.Enums;

namespace TestConstantsLib;

public static partial class TestConstants
{
    public static Citizen TEST_CITIZEN { get; } = new(CITIZEN_NAME);
    public static Admin TEST_ADMIN { get; } = new(ADMIN_NAME);
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
