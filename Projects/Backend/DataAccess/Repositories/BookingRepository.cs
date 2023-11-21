using Common.Entities;
using Common.Entities.User;
using DanhoLibrary.NLayer;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

/// <summary>
/// Repository for <see cref="Booking"/>.
/// This class extends <see cref="BaseRepository{TEntity, TId}"/> from my external library, DanhoLibrary.NLayer.
/// <see cref="BaseRepository{TEntity, TId}"/> contains many different kinds of CRUD related methods, so this class does not need to implement any "basic" CRUD operations.
/// </summary>
public class BookingRepository : BaseRepository<Booking, Guid>
{
    public BookingRepository(CitizenTaxiDbContext context) : base(context) { }

    public List<Booking> GetFromCitizen(Citizen citizen) => GetFromCitizenId(citizen.Id);
    public List<Booking> GetFromCitizenId(Guid citizenId) => Booking.RELATIONS
        .Aggregate(_dbSet.AsQueryable(), (current, relation) => current.Include(relation))
        .Where(booking => booking.Citizen.Id == citizenId)
        .ToList();
}
