using Common.Entities;
using Common.Entities.User;
using Microsoft.EntityFrameworkCore;

namespace DataAccess;

public class CitizenTaxiDbContext : DbContext
{
    public CitizenTaxiDbContext() {}
    public CitizenTaxiDbContext(DbContextOptions<CitizenTaxiDbContext> options) : base(options) {}

    public DbSet<Admin> Admins { get; set; }
    public DbSet<Citizen> Citizens { get; set; }
    public DbSet<Login> Logins { get; set; }
    public DbSet<Note> Notes { get; set; }
    public DbSet<Booking> Bookings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        InsertSeedData(builder);
    }

    private static void InsertSeedData(ModelBuilder builder)
    {
        builder.Entity<Admin>().HasData(MockData.Admin);
        builder.Entity<Citizen>().HasData(MockData.Citizen);

        builder.Entity<Login>().HasData(MockData.AdminLogin);
        builder.Entity<Login>().HasData(MockData.CitizenLogin);

        builder.Entity<Note>().HasData(MockData.CitizenNote);
        builder.Entity<Booking>().HasData(MockData.CitizenBookings);
    }
}
