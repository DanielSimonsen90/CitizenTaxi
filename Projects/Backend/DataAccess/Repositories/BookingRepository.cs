using Common.Entities;
using Common.Entities.User;
using DanhoLibrary.NLayer;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class BookingRepository : BaseRepository<Booking, Guid>
{
    public BookingRepository(CitizenTaxiDbContext context) : base(context) { }

    public List<Booking> GetFromCitizen(Citizen citizen) => Booking.RELATIONS
        .Aggregate(_dbSet.AsQueryable(), (current, relation) => current.Include(relation))
        .Where(booking => booking.Citizen.Id == citizen.Id)
        .ToList();
}
