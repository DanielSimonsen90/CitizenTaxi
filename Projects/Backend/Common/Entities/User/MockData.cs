using Common.Enums;

namespace Common.Entities.User;

internal static class MockData
{
    internal static readonly Admin Admin = new("Admin", Role.Admin);
    internal static readonly Citizen Citizen = new("Citizen", Role.Citizen);

    internal static readonly Login AdminLogin = new("admin", "admin123", Admin);
    internal static readonly Login CitizenLogin = new("citizen", "citizen123", Citizen);

    internal static readonly Note CitizenNote = new(Citizen, pensioner: true, residence: "Solvej 10, 0000 God by", 
        CarHeight.High, HelpingUtil.WheelChair, Companion.WithHelper, Follow.Both);
    internal static readonly List<Booking> CitizenBookings = new()
    {
        new(pickup: "Solvej 10, 0000 God by", destination: "Frederikshavn Sygehus", arrival: DateTime.Now.AddHours(2), Citizen),
        new(pickup: "Frederikshavn Sygehus", destination: "Solvej 10, 0000 God by", arrival: DateTime.Now.AddHours(3).AddMinutes(30), Citizen)
    };
}
