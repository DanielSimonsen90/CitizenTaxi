using Common.Entities;
using Common.Entities.User;
using Common.Enums;
using DanhoLibrary.NLayer;
using System.Text.Json;
#nullable disable

namespace DataAccessTests;

internal static class TestConstants
{
    public const string CITIZEN_NAME = "Test citizen";
    public const string RESIDENCE = "Solvej 10, 0000 God by";

    public static Citizen TEST_CITIZEN = new (CITIZEN_NAME);
    public static Note TEST_NOTE = new (
        pensioner: true,
        residence: RESIDENCE,
        carHeight: CarHeight.Low,
        helpingUtil: HelpingUtil.None,
        companion: Companion.Alone,
        follow: Follow.No);

    public static T Clone<T>(this T self, Guid? newId = null) where T : BaseEntity<Guid>
    {
        T result = JsonSerializer.Deserialize<T>(JsonSerializer.Serialize(self));
        if (newId is not null) result.Id = (Guid)newId;
        
        return result;
    }
}
