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

    /// <summary>
    /// Get a login by searching for <paramref name="username"/>
    /// </summary>
    /// <param name="username">The username to search for</param>
    /// <returns>Login entity matching <paramref name="username"/>, if any</returns>
    public Login? GetLoginByUsername(string username) => Get(login => login.Username == username);
}
