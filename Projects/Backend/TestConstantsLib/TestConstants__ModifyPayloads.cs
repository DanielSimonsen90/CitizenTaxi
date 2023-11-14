using Business.Models.Payloads;
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
}
