using Business.Exceptions;
using Business.Models;
using Business.Models.Payloads;
using Common.Entities;
using System.Security.Cryptography;
using System.Text;

namespace Business.Services;

/// <summary>
/// Service for <see cref="Login"/>
/// This is used for login attempts and password encryption.
/// </summary>
public class LoginService
{
    private const int keySize = 64;
    private const int iterations = 350_000;
    private static readonly HashAlgorithmName hashAlgorithm = HashAlgorithmName.SHA512;

    /// <summary>
    /// <see cref="UnitOfWork"/> for database access.
    /// This is used to get <see cref="Login"/> from database in <see cref="TryLogin(LoginPayload)"/>
    /// </summary>
    private readonly UnitOfWork _uow;
    private readonly CacheService _cacheService;

    /// <summary>
    /// Constructor receives <see cref="UnitOfWork"/> and <see cref="CacheService"/> through dependency injection.
    /// </summary>
    /// <param name="uow">UnitOfWork to receive login and user details</param>
    /// <param name="cacheService">CacheService to receive login attempts from backend cache</param>
    public LoginService(UnitOfWork uow, CacheService cacheService)
    {
        _uow = uow;
        _cacheService = cacheService;
    }

    public bool TryLogin(LoginPayload login)
    {
        // Check if the user has tried to login too many times
        if (_cacheService.LoginAttempts.ContainsKey(login.Username))
        {
            LoginAttempt attempt = _cacheService.LoginAttempts[login.Username];

            if (attempt.Attempts >= LoginAttempt.MAX_LOGIN_ATTEMPTS)
            {
                if (attempt.CanTryAgain) _cacheService.LoginAttempts.Remove(login.Username);
                else throw new TooManyLoginAttemptsException(attempt.CanTryAgainAt - DateTime.UtcNow);
            }
        }

        // Find a login with the given username and password and check if it exists
        Login? loginEntity = _uow.Logins.Get(l => l.Username == login.Username);
        bool correct = loginEntity is not null && IsCorrectPassword(login.Password, loginEntity.Salt, loginEntity.Password);

        // If the login is not correct, add 1 to the login attempts for the given username
        if (!correct)
        {
            LoginAttempt attempt = _cacheService.LoginAttempts.ContainsKey(login.Username) 
                ? _cacheService.LoginAttempts[login.Username] 
                : new LoginAttempt();
            attempt.Attempts++;
            _cacheService.LoginAttempts[login.Username] = attempt;
            return correct;
        }

        _cacheService.LoginAttempts.Remove(login.Username);
        return correct;
    }

    ///
    ///  The code below was inspired by the article: https://code-maze.com/csharp-hashing-salting-passwords-best-practices/
    ///

    /// <summary>
    /// Generates a secure password hash and salt from the given unencrypted password.
    /// </summary>
    /// <param name="unencrypted">Unencrypted value</param>
    /// <returns>Encrypted value</returns>
    public static string GenerateEncrypedPassword(string unencrypted, string salt)
    {
        // Convert unencrypted string into hash data with provided salt
        byte[] hash = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(unencrypted),
            Convert.FromBase64String(salt),
            iterations,
            hashAlgorithm,
            keySize);

        return Convert.ToBase64String(hash);
    }
    public static string GenerateSalt() => Convert.ToBase64String(RandomNumberGenerator.GetBytes(keySize));

    public static bool IsCorrectPassword(string unencrypted, string salt, string encrypted)
    {
        byte[] saltValue = Convert.FromBase64String(salt);
        byte[] hash = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(unencrypted),
            saltValue,
            iterations,
            hashAlgorithm,
            keySize);

        return Convert.ToBase64String(hash) == encrypted;
    }
}
