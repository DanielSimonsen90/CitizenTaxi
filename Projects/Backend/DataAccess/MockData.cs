﻿using Common.Entities;
using Common.Entities.User;
using Common.Enums;

namespace DataAccess;

/// <summary>
/// Mock/Seed data for the database for testing purposes.
/// </summary>
internal static class MockData
{
    internal static readonly Admin Admin = new("Admin") { Id = Guid.Parse("00000000-0000-0000-0000-000000000001") };
    internal static readonly Citizen Citizen = new("Borger") { Id = Guid.Parse("00000000-0000-0000-0000-000000000002") };

    internal static readonly Login AdminLogin = new("admin", "VtH/hEKvAnRHm/c0lS0IwkDIgl/IzbaPDep4QZSx6hV2br3jnBVhet9RdyBtAvFBoD5AR38haS2IelS/BIbhUg==", "salt", Admin) // admin123
    { 
        Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
        UserId = Admin.Id,
    };
    internal static readonly Login CitizenLogin = new("borger", "ALXb8Wpq657/JDm5lNuxyPXIKCPgET0FZIZfzgNUJbd1LRXJWTLXbIscvif2p4lZXHmIsxe+7QwT9fl6mD6hkw==", "salt", Citizen) // borger123
    { 
        Id = Guid.Parse("00000000-0000-0000-0000-000000000004"),
        UserId = Citizen.Id,
    };

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
