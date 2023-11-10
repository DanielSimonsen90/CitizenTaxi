using Common.Entities;
using Common.Entities.User;
using Common.Enums;

namespace DataAccess;

/// <summary>
/// Mock/Seed data for the database for testing purposes.
/// </summary>
internal static class MockData
{
    internal static readonly Admin Admin = new("Admin", Role.Admin) { Id = Guid.Parse("00000000-0000-0000-0000-000000000001") };
    internal static readonly Citizen Citizen = new("Borger", Role.Citizen) { Id = Guid.Parse("00000000-0000-0000-0000-000000000002") };

    internal static readonly Login AdminLogin = new("admin", "admin123", Admin) { Id = Guid.Parse("00000000-0000-0000-0000-000000000003") };
    internal static readonly Login CitizenLogin = new("borger", "borger123", Citizen) { Id = Guid.Parse("00000000-0000-0000-0000-000000000004") };

    internal static readonly Note CitizenNote = new(pensioner: true, residence: "Solvej 10, 0000 God by", 
        CarHeight.High, HelpingUtil.WheelChair, Companion.WithHelper, Follow.Both)
        {
            Id = Guid.Parse("00000000-0000-0000-0000-000000000005"),
            CitizenId = Citizen.Id,
        };

    internal static readonly List<Booking> CitizenBookings = new() 
    { 
        new(pickup: "Solvej 10, 0000 God by", destination: "Frederikshavn Sygehus", arrival: DateTime.Now.AddHours(2)) 
        { 
            Id = Guid.Parse("00000000-0000-0000-0000-000000000006"),
            CitizenId = Citizen.Id,
        },
        new(pickup: "Frederikshavn Sygehus", destination: "Solvej 10, 0000 God by", arrival: DateTime.Now.AddHours(3).AddMinutes(30)) 
        { 
            Id = Guid.Parse("00000000-0000-0000-0000-000000000007"),
            CitizenId = Citizen.Id,
        },
    };
}
