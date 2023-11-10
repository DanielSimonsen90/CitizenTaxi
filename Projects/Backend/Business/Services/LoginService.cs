using Business.Models.Payloads;
using Common.Entities;

namespace Business.Services;

public class LoginService
{
    private readonly Dictionary<string, int> _loginAttempts = new(); // <username, attempts>
    private readonly UnitOfWork _uow;

    public LoginService(UnitOfWork uow)
    {
        _uow = uow;
    }

    public bool TryLogin(LoginPayload login)
    {
        bool correct = _uow.Logins.Get(l =>
            l.Username == login.Username
            && l.Password == login.Password)
            != null;

        if (!correct)
        {
            int attempts = _loginAttempts.ContainsKey(login.Username) ? _loginAttempts[login.Username] : 0;
            _loginAttempts[login.Username] = attempts + 1;
        }

        return correct;
    }

    public string GenerateEncrypedPassword(Login login, string unencrypted)
    {
        throw new NotImplementedException();
    }
}
