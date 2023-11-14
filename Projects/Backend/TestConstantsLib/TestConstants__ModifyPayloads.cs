using Business.Models.Payloads;
using Common.Enums;
#nullable disable

namespace TestConstantsLib;

public static partial class TestConstants
{
    public static BookingModifyPayload TEST_BOOKING_PAYLOAD { get; } = new()
    {
        CitizenId = TEST_CITIZEN.Id,
        Pickup = RESIDENCE,
        Destination = HOSTPITAL_FREDERIKSHAVN,
        Arrival = DateTime.Now.AddHours(2),
    };
    public static UserModifyPayload TEST_USER_PAYLOAD { get; } = new()
    {
        Name = "Test User",
        Username = "TestUsername",
        Password = "TestPassword",
        Role = Role.Citizen
    };
}
