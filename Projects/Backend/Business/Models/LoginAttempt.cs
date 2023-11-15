namespace Business.Models;

internal class LoginAttempt
{
    public const int MAX_LOGIN_ATTEMPTS = 3;

    public int Attempts { get; set; } = 0;
    public DateTime AttemptStarted { get; set; } = DateTime.UtcNow;
    public bool CanTryAgain => DateTime.UtcNow > AttemptStarted.AddMinutes(5);
}
