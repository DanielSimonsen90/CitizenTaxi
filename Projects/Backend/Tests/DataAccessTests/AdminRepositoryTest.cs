using TestConstantsLib;
using DataAccess.Repositories;
using Common.Entities;
using Common.Entities.User;

namespace DataAccessTests;

internal class AdminRepositoryTest : ABaseRepositoryTest<Admin, AdminRepository>
{
    /// <summary>
    /// Set repository to <see cref="UnitOfWork.Admins"/>
    /// </summary>
    protected override AdminRepository Repository => UnitOfWork.Admins;

    /// <summary>
    /// Update the entity for <see cref="ABaseRepositoryTest{TEntity, TRepository}.Update()"/>
    /// </summary>
    /// <param name="entity">The entity to update</param>
    /// <returns>The updated entity</returns>
    protected override Admin Update(Admin entity)
    {
        entity.Name = "Updated name";
        return entity;
    }

    /// <summary>
    /// Testing <see cref="AdminRepository.GetFromLogin(Login)"/>
    /// 
    /// As <see cref="AdminRepository.GetFromLogin(Login)"/> is inherited from <see cref="AUserRepository{TUser}.GetFromLogin(Login)"/>, 
    /// it is necessary to test if the method only returns <see cref="Admin"/>s. and not <see cref="Citizen"/>s too.
    /// </summary>
    [Test]
    public void GetFromLogin_ReturnsAdminFromLogin()
    {
        // Arrange
        var admin = new Admin("Admin");
        admin.Login = new Login("admin", "admin", admin);
        Repository.Add(admin);

        var citizen = TestConstants.TEST_CITIZEN.CloneEntity();
        citizen.Login = new Login("citizen", "citizen", citizen);
        UnitOfWork.Citizens.Add(citizen);

        UnitOfWork.SaveChanges(); // Admin should be added to database with login

        // Act
        var resultAdmin = Repository.GetFromLogin(admin.Login);
        var resultCitizen = Repository.GetFromLogin(citizen.Login);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(resultAdmin, Is.Not.Null, "Result admin is not null");
            Assert.That(resultAdmin!.Id, Is.EqualTo(admin.Id), "Result admin id is same as admin id");
            Assert.That(resultCitizen, Is.Null, "Result cititzen is null");
        });
    }
}
