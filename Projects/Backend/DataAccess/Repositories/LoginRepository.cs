using Common.Entities;
using DanhoLibrary.NLayer;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class LoginRepository : BaseRepository<Login, Guid>
{
    public LoginRepository(CitizenTaxiDbContext context) : base(context) { }
}
