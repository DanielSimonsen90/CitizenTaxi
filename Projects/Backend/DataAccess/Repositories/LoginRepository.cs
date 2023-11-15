using Common.Entities;
using Common.Entities.User;
using DanhoLibrary.NLayer;

namespace DataAccess.Repositories;

/// <summary>
/// Repository for <see cref="Login"/>.
/// This class extends <see cref="BaseRepository{TEntity, TId}"/> from my external library, DanhoLibrary.NLayer.
/// <see cref="BaseRepository{TEntity, TId}"/> contains many different kinds of CRUD related methods, so this class does not need to implement any "basic" CRUD operations.
/// </summary>
public class LoginRepository : BaseRepository<Login, Guid>
{
    public LoginRepository(CitizenTaxiDbContext context) : base(context) { }

    public Login? GetLoginByUsername(string username) => GetWithRelations(login => login.Username == username);
}
