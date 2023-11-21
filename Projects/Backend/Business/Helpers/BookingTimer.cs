namespace Business.Helpers;

public class BookingTimer
{
    private readonly Timer _timer;
    private CancellationTokenSource _tokenSource;
    public static int TimeoutsStarted = 0;

    public static Action StartTimeout(Action callback, TimeSpan timeout)
    {
        TimeoutsStarted++;
        return new BookingTimer(() =>
        {
            TimeoutsStarted--;
            callback();
        }, timeout).Cancel;
    }

    public BookingTimer(Action callback, TimeSpan timeout)
    {
        _tokenSource = new CancellationTokenSource();
        _timer = new Timer(
            callback: (_) => callback(),
            state: null,
            dueTime: timeout,
            period: new TimeSpan(0, 0, 0, 0, -1));
    }

    public void ChangeTimeout(int milliseconds)
    {
        _tokenSource.Cancel();
        _tokenSource = new CancellationTokenSource();
    }

    public void Cancel()
    {
        TimeoutsStarted--;
        _tokenSource.Cancel();
        _timer.Change(Timeout.Infinite, Timeout.Infinite);
    }
}
