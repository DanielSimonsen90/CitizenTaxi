using DanhoLibrary.NLayer;
using DataAccess;
using DataAccess.Repositories;

namespace Business.Services;

/// <summary>
/// UnitOfWork for the <see cref="CitizenTaxiDbContext"/>.
/// This is a wrapper/service for all entity repositories.
/// This class extends <see cref="BaseUnitOfWork{TContext}"/> to ensure that the <see cref="CitizenTaxiDbContext"/> is passed to the base class and contains a <see cref="BaseUnitOfWork{TDbContext}.SaveChanges"/>
/// <see cref="BaseUnitOfWork{TDbContext}"/> is a class that comes from my library, DanhoLibrary.NLayer.
/// </summary>
public class UnitOfWork : BaseUnitOfWork<CitizenTaxiDbContext>
{
    /// <summary>
    /// Constructor receives <see cref="CitizenTaxiDbContext"/> from services
    /// </summary>
    /// <param name="context">The DbContext used to connect to the database</param>
    public UnitOfWork(CitizenTaxiDbContext context) : base(context)
    {
        // Instanciate all repositories
        Admins = new(context);
        Citizens = new(context);
        Logins = new(context);
        Bookings = new(context);
        Notes = new(context);
    }

    /// <summary>
    /// The <see cref="Common.Entities.User.Admin"/> repository used for CRUD operations on <see cref="Common.Entities.User.Admin"/>
    /// </summary>
    public AdminRepository Admins { get; set; }
    /// <summary>
    /// The <see cref="Common.Entities.User.Citizen"/> repository used for CRUD operations on <see cref="Common.Entities.User.Citizen"/>
    /// </summary>
    public CitizenRepository Citizens { get; set; }
    /// <summary>
    /// The <see cref="Common.Entities.Login"/> repository used for CRUD operations on <see cref="Common.Entities.Login"/>
    /// </summary>
    public LoginRepository Logins { get; set; }
    /// <summary>
    /// The <see cref="Common.Entities.Booking"/> repository used for CRUD operations on <see cref="Common.Entities.Booking"/>
    /// </summary>
    public BookingRepository Bookings { get; set; }
    /// <summary>
    /// The <see cref="Common.Entities.Note"/> repository used for CRUD operations on <see cref="Common.Entities.Note"/>
    /// </summary>
    public NoteRepository Notes { get; set; }
}
