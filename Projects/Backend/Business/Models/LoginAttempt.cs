namespace Business.Models;

public class LoginAttempt
{
    public const int MAX_LOGIN_ATTEMPTS = 3;
    public const int TRY_AGAIN_WAIT_MINUTES = 5;

    public int Attempts { get; set; } = 0;
    public DateTime AttemptStarted { get; set; } = DateTime.UtcNow;
    public DateTime CanTryAgainAt => AttemptStarted.AddMinutes(TRY_AGAIN_WAIT_MINUTES);
    public bool CanTryAgain => DateTime.UtcNow > CanTryAgainAt;
}
