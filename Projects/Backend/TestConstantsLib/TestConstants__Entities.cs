using Common.Entities;
using Common.Entities.User;
using Common.Enums;

namespace TestConstantsLib;

/// <summary>
/// TestConstants is a partial class for splitting up constants into multiple files.
/// The class is used in multiple testing projects for dummy data.
/// </summary>
public static partial class TestConstants
{
    public static Citizen TEST_CITIZEN => new(CITIZEN_NAME);
    public static Admin TEST_ADMIN => new(ADMIN_NAME);
    public static Note TEST_NOTE => new(
        pensioner: true,
        residence: RESIDENCE,
        carHeight: CarHeight.Low,
        helpingUtil: HelpingUtil.None,
        companion: Companion.Alone,
        follow: Follow.No);

    public static Booking TEST_BOOKING => new(
        pickup: RESIDENCE,
        destination: HOSTPITAL_FREDERIKSHAVN,
        arrival: DateTime.Now.AddHours(1))
    {
        Citizen = TEST_CITIZEN,
        CitizenId = TEST_CITIZEN.Id,
    };

    public static Login TEST_LOGIN => new(USERNAME, PASSWORD, TEST_CITIZEN);
}
