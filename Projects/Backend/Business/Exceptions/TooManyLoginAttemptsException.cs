namespace Business.Exceptions;

/// <summary>
/// This exception will occur, when a user tries to login too many times.
/// <see cref="Models.LoginAttempt.MAX_LOGIN_ATTEMPTS"/>
/// </summary>
public class TooManyLoginAttemptsException : Exception
{
    public TooManyLoginAttemptsException(TimeSpan timeLeft) : base(
        $"Too many login attempts - try again in {timeLeft.Minutes}min & {timeLeft.Seconds}sec") { }
}
