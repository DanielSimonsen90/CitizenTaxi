using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Helpers;

public class BookingTimer
{
    private readonly Timer _timer;
    private CancellationTokenSource _tokenSource;

    public static Action StartTimeout(Action callback, TimeSpan timeout) => new BookingTimer(callback, timeout).Cancel;

    public BookingTimer(Action callback, TimeSpan timeout)
    {
        _tokenSource = new CancellationTokenSource();
        _timer = new Timer((_) => callback(), null, (int)timeout.TotalMicroseconds, Timeout.Infinite);
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
