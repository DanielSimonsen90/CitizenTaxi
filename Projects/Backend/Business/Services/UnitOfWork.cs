using DanhoLibrary.NLayer;
using DataAccess;
using DataAccess.Repositories;

namespace Business.Services;

public class UnitOfWork : BaseUnitOfWork<CitizenTaxiDbContext>
{
    public UnitOfWork(CitizenTaxiDbContext context) : base(context)
    {
        Admins = new(context);
        Citizens = new(context);
        Logins = new(context);
        Bookings = new(context);
        Notes = new(context);
    }

    public AdminRepository Admins { get; set; }
    public CitizenRepository Citizens { get; set; }
    public LoginRepository Logins { get; set; }
    public BookingRepository Bookings { get; set; }
    public NoteRepository Notes { get; set; }

}
