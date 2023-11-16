using Common.DTOs;
using Common.Entities.User;
using Business.Models.Payloads;
using DataAccess.Repositories;
using API.Controllers;
using Business.Services;
using TestConstantsLib;
using Microsoft.AspNetCore.Mvc;
using Common.Entities;

namespace ApiTests;

/// <summary>
/// Testing <see cref="UsersController"/> specified towards <see cref="Citizen"/>s
/// </summary>
internal class CitizensControllerTest : ABaseControllerTest<Citizen, CitizenDTO, UserModifyPayload, CitizenRepository>
{
    /// <summary>
    /// Point to <see cref="UnitOfWork.Citizens"/>
    /// </summary>
    protected override CitizenRepository Repository => UnitOfWorkMock.Object.Citizens;
    /// <summary>
    /// Create <see cref="UsersController"/> with <see cref="UnitOfWork"/>
    /// </summary>
    /// <param name="uow">UnitOfWork for service dependency</param>
    /// <returns></returns>
    protected override BaseController CreateController(UnitOfWork uow) => new UsersController(
        uow, 
        new LoginService(uow, new CacheService()), 
        new AuthService(new CacheService()));

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
            Assert.That(expectAllCitizens, Is.InstanceOf<OkObjectResult>(), "Expecting all citizens returns 200 OkObject");
            Assert.That(expectAllAdmins, Is.InstanceOf<OkObjectResult>(), "Epxecting all admins returns 200 OkObject");
            Assert.That(expectAllUsers, Is.InstanceOf<OkObjectResult>(), "Expecting all users returns 200 OkObject");

            Assert.That(GetValueFromResult<List<CitizenDTO>>(expectAllCitizens), Has.Count.EqualTo(2), "Expecting correct amount of citizens");
            Assert.That(GetValueFromResult<List<UserDTO>>(expectAllAdmins), Has.Count.EqualTo(1), "Expecting correct amount of admins");
            Assert.That(GetValueFromResult<object>(expectAllUsers), Has.Property("Citizens").InstanceOf<List<CitizenDTO>>(), "Expecting \"Citizen\" property in all users");
            Assert.That(GetValueFromResult<object>(expectAllUsers), Has.Property("Admins").InstanceOf<List<UserDTO>>(), "Expecting \"Admin\" property in all users");
        });
    }
    [Test] public override Task GetEntity() => GetEntity(TestConstants.TEST_CITIZEN, Citizen.RELATIONS);

    [Test] public override Task UpdateEntity() => UpdateEntity(TestConstants.TEST_CITIZEN, TestConstants.TEST_USER_PAYLOAD);
    [Test] public override Task DeleteEntity() => DeleteEntity(TestConstants.TEST_CITIZEN);
}
