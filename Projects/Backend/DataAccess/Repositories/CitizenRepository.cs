using Common.Entities;
using Common.Entities.User;
using Common.Enums;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

/// <summary>
/// Repository for <see cref="Citizen"/>.
/// This class extends <see cref="AUserRepository{T}"/> to ensure that the generic methods from <see cref="DanhoLibrary.NLayer.BaseRepository{TEntity, TId}"/> may be used.
/// </summary>
public class CitizenRepository : AUserRepository<Citizen>
{
    public CitizenRepository(CitizenTaxiDbContext context) : base(context) { }

    public override Citizen? GetFromLogin(Login login) => FindUserByLoginAndRole(
        Citizen.RELATIONS.Aggregate(_dbSet.AsQueryable(), (current, relation) => current.Include(relation)),
        login, 
        Role.Admin);

    public Citizen? GetCitizenByEmail(string email) => Get(citizen => citizen.Email == email);
}
