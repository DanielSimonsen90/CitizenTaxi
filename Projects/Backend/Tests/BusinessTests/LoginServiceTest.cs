using TestConstantsLib;
using Business.Models.Payloads;
using Business.Services;
using DataAccess;
using Common.Entities;
using Common.Entities.User;

using Microsoft.EntityFrameworkCore;
using Business.Models;
using Business.Exceptions;

namespace BusinessTests;

public class LoginServiceTest
{
    private LoginService _loginService;
    private UnitOfWork _uow;

    /// <summary>
    /// This method is called before each test, re-creating in-memory database and initializing <see cref="UnitOfWork"/> and <see cref="LoginService"/>
    /// </summary>
    [SetUp]
    public void Setup()
    {
        var context = new CitizenTaxiDbContext(
            new DbContextOptionsBuilder<CitizenTaxiDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
        _uow = new(context);
        _loginService = new(_uow, new CacheService());
    }

    /// <summary>
    /// Testing <see cref="LoginService.TryLogin(LoginPayload)"/>
    /// </summary>
    [Test]
    public void TryLogin()
    {
        // Arrange
        // Insert a citizen with login into database
        Citizen citizen = TestConstants.TEST_CITIZEN.CloneEntity();
        Login login = TestConstants.TEST_LOGIN;
        citizen.Login = login;

        _uow.Logins.Add(login);
        _uow.SaveChanges();

        // Create payloadtests
        LoginPayload payloadCorrect = TestConstants.TEST_LOGIN_PAYLOAD;
        LoginPayload payloadNotIncluded = TestConstants.TEST_LOGIN_PAYLOAD_TWO;
        LoginPayload payloadBadUsername = TestConstants.TEST_LOGIN_PAYLOAD.ClonePayload();
        payloadBadUsername.Username = "bad username";
        LoginPayload payloadBadPassword = TestConstants.TEST_LOGIN_PAYLOAD.ClonePayload();
        payloadBadPassword.Password = "bad password";

        // Act
        bool canLoginWithCorrectDetails = _loginService.TryLogin(payloadCorrect);
        bool cannotLoginWithDetailsNotSaved = _loginService.TryLogin(payloadNotIncluded);
        bool cannotLoginWithBadUsername = _loginService.TryLogin(payloadBadUsername);
        bool cannotLoginWithBadPassword = _loginService.TryLogin(payloadBadPassword);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(canLoginWithCorrectDetails, Is.True, "Login with correct details");
            Assert.That(cannotLoginWithDetailsNotSaved, Is.False, "Login with details not saved in database");
            Assert.That(cannotLoginWithBadUsername, Is.False, "Login with bad username");
            Assert.That(cannotLoginWithBadPassword, Is.False, "Login with bad password");
            Assert.Throws<TooManyLoginAttemptsException>(() =>
            {
                // Login with bad password too many times
                for (int i = 0; i < LoginAttempt.MAX_LOGIN_ATTEMPTS; i++)
                {
                    _loginService.TryLogin(payloadBadPassword);
                }
            }, "Login rate limited by login attempts");
        });
    }

    /// <summary>
    /// Testing <see cref="LoginService.GenerateEncrypedPassword(Login, string)"/>
    /// </summary>
    [Test]
    public void GenerateEncrypedPassword()
    {
        // Arrange
        string password = TestConstants.PASSWORD;

        // Act
        string encryptedPassword = LoginService.GenerateEncrypedPassword(password, LoginService.GenerateSalt());

        // Assert
        Assert.That(encryptedPassword, Is.Not.EqualTo(password), "Encrypted password is not equal to password");
    }
}