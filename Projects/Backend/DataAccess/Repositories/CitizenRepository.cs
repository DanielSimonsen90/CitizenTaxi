using Common.Entities.User;

namespace DataAccess.Repositories;

public class CitizenRepository : AUserRepository<Citizen>
{
    public CitizenRepository(CitizenTaxiDbContext context) : base(context) { }
}
