namespace Business.Helpers;

public class BookingTimer
{
    private readonly Timer _timer;
    private CancellationTokenSource _tokenSource;
    public static int TimeoutsStarted = 0;

    public static Action StartTimeout(Func<Task> callback, TimeSpan timeout)
    {
        TimeoutsStarted++;
        return new BookingTimer(async () =>
        {
            TimeoutsStarted--;
            await callback();
        }, timeout).Cancel;
    }

    public BookingTimer(Func<Task> callback, TimeSpan timeout)
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
        _timer.Change(milliseconds, Timeout.Infinite);
    }

    public void Cancel()
    {
        _tokenSource.Cancel();
        _timer.Change(Timeout.Infinite, Timeout.Infinite);
    }
}
