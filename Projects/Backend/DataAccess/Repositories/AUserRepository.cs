using Common.Entities;
using Common.Entities.User;
using DanhoLibrary.NLayer;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

/// <summary>
/// Abstract User Repository for the <see cref="AUser"/> entity.
/// This class extends <see cref="BaseRepository{TEntity, TId}"/> from my external library, DanhoLibrary.NLayer.
/// <see cref="BaseRepository{TEntity, TId}"/> contains many different kinds of CRUD related methods, so this class does not need to implement any "basic" CRUD operations.
/// Usually <see cref="BaseRepository{TEntity, TId}"/> receives a proper class that extends <see cref="BaseEntity{TId}"/>, but in this case, it receives <see cref="TUser"/> as a generic for <see cref="Citizen"/> and <see cref="Admin"/>.
/// 
/// Used in <see cref="CitizenRepository"/> and <see cref="AdminRepository"/>.
/// </summary>
/// <typeparam name="TUser"></typeparam>
public abstract class AUserRepository<TUser> : BaseRepository<TUser, Guid>
    where TUser : AUser // TUser must be a class that extends AUser.
{
    protected AUserRepository(CitizenTaxiDbContext context) : base(context) { }

    /// <summary>
    /// Gets a <see cref="TUser"/> from a <see cref="Login"/>.
    /// </summary>
    /// <param name="login">Login entity</param>
    /// <returns><see cref="TUser"/> if found, null if not</returns>
    public TUser? GetFromLogin(Login login) => _dbSet
        .Include(u => u.Login) // Include the Login relation
        .FirstOrDefault(user => // Find the user where the login matches the login parameter.
            user.Login.Username == login.Username
            && user.Login.Password == login.Password);
}
