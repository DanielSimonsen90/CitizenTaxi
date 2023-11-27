using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace DataAccess;

/// <summary>
/// This factory class instanciates a <see cref="CitizenTaxiDbContext"/> and assigning it a connection string from appsettings.json.
/// </summary>
internal class CitizenTaxiDbContextFactory : IDesignTimeDbContextFactory<CitizenTaxiDbContext>
{
    /// <summary>
    /// Method ran by the compiler when creating a migration.
    /// </summary>
    /// <param name="args"></param>
    /// <returns>The instance of <see cref="CitizenTaxiDbContext"/></returns>
    public CitizenTaxiDbContext CreateDbContext(string[] args)
    {
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<CitizenTaxiDbContext>();
        optionsBuilder.UseSqlServer(configuration.GetConnectionString(
            //"DefaultConnection"
            "ReleaseConnection"
        ));

        return new CitizenTaxiDbContext(optionsBuilder.Options);
    }
}
