using Common.Entities;
using Common.Entities.User;
using DanhoLibrary.NLayer;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public abstract class AUserRepository<TUser> : BaseRepository<TUser, Guid>
    where TUser : AUser
{
    protected AUserRepository(CitizenTaxiDbContext context) : base(context) { }

    public TUser? GetFromLogin(Login login) => _dbSet
        .Include(u => u.Login)
        .FirstOrDefault(user =>
            user.Login.Username == login.Username
            && user.Login.Password == login.Password);
}
