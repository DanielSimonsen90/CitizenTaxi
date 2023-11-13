using Common.Entities;
using Common.Entities.User;
using Common.Enums;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

/// <summary>
/// Repository for <see cref="Admin"/>.
/// This class extends <see cref="AUserRepository{T}"/> to ensure that the generic methods from <see cref="DanhoLibrary.NLayer.BaseRepository{TEntity, TId}"/> may be used.
/// </summary>
public class AdminRepository : AUserRepository<Admin>
{
    public AdminRepository(CitizenTaxiDbContext context) : base(context) { }

    public override Admin? GetFromLogin(Login login) => FindUserByLoginAndRole(
        Admin.RELATIONS.Aggregate(_dbSet.AsQueryable(), (current, relation) => current.Include(relation)),
        login,
        Role.Admin);
}
