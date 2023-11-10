using Common.Entities.User;

namespace DataAccess.Repositories;

public class AdminRepository : AUserRepository<Admin>
{
    public AdminRepository(CitizenTaxiDbContext context) : base(context) { }
}
