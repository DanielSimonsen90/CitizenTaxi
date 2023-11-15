using Business.Models.Payloads;
using Business.Services;
using Common.Entities;
using Common.Entities.User;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using TestConstantsLib;

namespace BusinessTests;

public class LoginServiceTest
{
    private LoginService _loginService;
    private UnitOfWork _uow;

    [SetUp]
    public void Setup()
    {
        var context = new CitizenTaxiDbContext(
            new DbContextOptionsBuilder<CitizenTaxiDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
        _uow = new(context);
        _loginService = new(_uow);
    }

    [Test]
    public void TryLogin()
    {
        // Arrange
        Login login = TestConstants.TEST_LOGIN;
        LoginPayload payload = TestConstants.TEST_LOGIN_PAYLOAD;
        LoginPayload payloadTwo = TestConstants.TEST_LOGIN_PAYLOAD_TWO;
        Citizen citizen = TestConstants.TEST_CITIZEN.CloneEntity();
        citizen.Login = login;

        _uow.Logins.Add(login);
        _uow.SaveChanges();

        // Act
        bool expectTrue = _loginService.TryLogin(payload);
        bool expectFalse = _loginService.TryLogin(payloadTwo);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(expectTrue, Is.True);
            Assert.That(expectFalse, Is.False);
        });
    }
}