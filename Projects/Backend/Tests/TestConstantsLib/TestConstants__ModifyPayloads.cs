using Business.Models.Payloads;
using Business.Services;
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
        Username = USERNAME,
        Password = PASSWORD,
        Role = Role.Citizen
    };
    public static LoginPayload TEST_LOGIN_PAYLOAD { get; } = new()
    {
        Username = USERNAME,
        Password = PASSWORD
    };
    public static LoginPayload TEST_LOGIN_PAYLOAD_TWO { get; } = new()
    {
        Username = USERNAME + "2",
        Password = PASSWORD + "2"
    };
}
