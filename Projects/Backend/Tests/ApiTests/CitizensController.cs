using Common.DTOs;
using Common.Entities.User;
using Business.Models.Payloads;
using DataAccess.Repositories;
using API.Controllers;
using Business.Services;
using TestConstantsLib;
using Microsoft.AspNetCore.Mvc;

namespace ApiTests;

internal class CitizensController : ABaseControllerTest<Citizen, CitizenDTO, UserModifyPayload, CitizenRepository>
{
    protected override CitizenRepository Repository => UnitOfWorkMock.Object.Citizens;
    protected override BaseController CreateController(UnitOfWork uow) => new UsersController(uow);

    [Test] public override Task CreateEntity() => CreateEntity(TestConstants.TEST_USER_PAYLOAD);

    [Test] 
    public override async Task GetEntities()
    {
        // Arrange
        Citizen a = TestConstants.TEST_CITIZEN;
        Citizen b = TestConstants.TEST_CITIZEN.CloneEntity(Guid.NewGuid());
        Admin admin = TestConstants.TEST_ADMIN.CloneEntity();

        Repository.AddRange(a, b);
        UnitOfWorkMock.Object.Admins.Add(admin);
        await SaveChangesAsync();

        // Act
        IActionResult expectAllCitizens = ((UsersController)controller).GetUsers(Common.Enums.Role.Citizen);
        IActionResult expectAllAdmins = ((UsersController)controller).GetUsers(Common.Enums.Role.Admin);
        IActionResult expectAllUsers = ((UsersController)controller).GetUsers(null);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(expectAllCitizens, Is.InstanceOf<OkObjectResult>());
            Assert.That(expectAllAdmins, Is.InstanceOf<OkObjectResult>());
            Assert.That(expectAllUsers, Is.InstanceOf<OkObjectResult>());

            Assert.That(GetValueFromResult<List<CitizenDTO>>(expectAllCitizens), Has.Count.EqualTo(2));
            Assert.That(GetValueFromResult<List<UserDTO>>(expectAllAdmins), Has.Count.EqualTo(1));
            Assert.That(GetValueFromResult<object>(expectAllUsers), Has.Property("Citizens").InstanceOf<List<CitizenDTO>>());
            Assert.That(GetValueFromResult<object>(expectAllUsers), Has.Property("Admins").InstanceOf<List<UserDTO>>());
        });
    }
    [Test] public override Task GetEntity() => GetEntity(TestConstants.TEST_CITIZEN, Citizen.RELATIONS);

    [Test] public override Task UpdateEntity() => UpdateEntity(TestConstants.TEST_CITIZEN, TestConstants.TEST_USER_PAYLOAD);
    [Test] public override Task DeleteEntity() => DeleteEntity(TestConstants.TEST_CITIZEN);

    // TODO: Implement login and logout

    [Test]
    public async Task Authenticate()
    {
        Assert.Pass();
    }
    [Test]
    public async Task Logout()
    {
        Assert.Pass();
    }
}
