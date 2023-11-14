using TestConstantsLib;
using DataAccess.Repositories;
using Common.DTOs;
using Common.Entities;
using Common.Entities.User;

namespace DataAccessTests;

internal class AdminRepositoryTest : ABaseRepositoryTest<Admin, UserDTO, AdminRepository>
{
    protected override AdminRepository Repository => UnitOfWork.Admins;

    protected override Admin Update(Admin entity)
    {
        entity.Name = "Updated name";
        return entity;
    }

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
            Assert.That(resultAdmin, Is.Not.Null);
            Assert.That(resultAdmin!.Id, Is.EqualTo(admin.Id));
            Assert.That(resultCitizen, Is.Null);
        });
    }
}
