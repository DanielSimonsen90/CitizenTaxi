namespace Business.Exceptions;

public class TooManyLoginAttemptsException : Exception
{
    public TooManyLoginAttemptsException(TimeSpan timeLeft) : base(
        $"Too many login attempts - try again in {timeLeft.Minutes}min & {timeLeft.Seconds}sec") { }
}
