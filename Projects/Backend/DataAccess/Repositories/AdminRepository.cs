using Common.Entities.User;

namespace DataAccess.Repositories;

/// <summary>
/// Repository for <see cref="Admin"/>.
/// This class extends <see cref="AUserRepository{T}"/> to ensure that the generic methods from <see cref="DanhoLibrary.NLayer.BaseRepository{TEntity, TId}"/> may be used.
/// </summary>
public class AdminRepository : AUserRepository<Admin>
{
    public AdminRepository(CitizenTaxiDbContext context) : base(context) { }
}
