using Common.Entities;
using Common.Entities.User;
using Microsoft.EntityFrameworkCore;

namespace DataAccess;

public class CitizenTaxiDbContext : DbContext
{
    // Overloading constructor to satisfy ASP.NET Core in creating the database.
    public CitizenTaxiDbContext() {}
    public CitizenTaxiDbContext(DbContextOptions<CitizenTaxiDbContext> options) : base(options) {}

    /// <summary>
    /// Admin table
    /// </summary>
    public DbSet<Admin> Admins { get; set; }
    /// <summary>
    /// Citizens table
    /// </summary>
    public DbSet<Citizen> Citizens { get; set; }
    /// <summary>
    /// Logins table
    /// </summary>
    public DbSet<Login> Logins { get; set; }
    /// <summary>
    /// Notes table
    /// </summary>
    public DbSet<Note> Notes { get; set; }
    /// <summary>
    /// Bookings table
    /// </summary>
    public DbSet<Booking> Bookings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        InsertSeedData(builder);
    }

    /// <summary>
    /// Inserts seed/mock data into the database using the <see cref="ModelBuilder"/> in <see cref="OnModelCreating(ModelBuilder)"/>.
    /// </summary>
    /// <param name="builder">ModelBuilder provided by <see cref="OnModelCreating(ModelBuilder)"/></param>
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
