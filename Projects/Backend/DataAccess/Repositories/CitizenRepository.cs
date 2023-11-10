using Common.Entities.User;

namespace DataAccess.Repositories;

/// <summary>
/// Repository for <see cref="Citizen"/>.
/// This class extends <see cref="AUserRepository{T}"/> to ensure that the generic methods from <see cref="DanhoLibrary.NLayer.BaseRepository{TEntity, TId}"/> may be used.
/// </summary>
public class CitizenRepository : AUserRepository<Citizen>
{
    public CitizenRepository(CitizenTaxiDbContext context) : base(context) { }
}
