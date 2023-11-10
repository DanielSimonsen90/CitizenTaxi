using Common.Entities;
using Common.Entities.User;
using DanhoLibrary.NLayer;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class BookingRepository : BaseRepository<Booking, Guid>
{
    public BookingRepository(CitizenTaxiDbContext context) : base(context) { }

    public List<Booking> GetFromCitizen(Citizen citizen) => _dbSet
        .Include(booking => booking.Citizen)
        .Where(note => note.Citizen.Id == citizen.Id)
        .ToList();
}
