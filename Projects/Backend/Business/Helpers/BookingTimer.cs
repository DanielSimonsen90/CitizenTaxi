using DanhoLibrary.Extensions;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Timer = System.Timers.Timer;
namespace Business.Helpers;

public class BookingTimer
{
    private readonly Timer _timer;
    public static Dictionary<string, BookingTimerItem> Items { get; set; } = new(); // <id, BookingTimerItem>
    public static List<BookingTimer>? Timers { get; set; } = new();

    public static Action StartTimeout(string id, Action callback, TimeSpan timeout)
    {
        if (Items.ContainsKey(id)) Items[id].Cancel();

        var timer = new BookingTimer(() =>
        {
            Items.Remove(id);
            callback();
        }, timeout);

        BookingTimerItem item = new()
        {
            FinishedAt = DateTime.Now.Add(timeout),
            Cancel = timer.Cancel
        };

        Items.Set(id, item);
        (Timers ??= new List<BookingTimer>()).Add(timer);
        return item.Cancel;
    }

    public BookingTimer(Action callback, TimeSpan timeout)
    {
        _timer = new Timer(timeout.TotalMicroseconds);
        _timer.Elapsed += (sender, args) =>
        {
            throw new Exception("This isn't working lol");
            callback();
            _timer.Stop();
            _timer.Dispose();
        };
        _timer.Start();
    }

    public void Cancel()
    {
        _timer.Stop();
    }
}

#nullable disable
public class BookingTimerItem
{
    public DateTime FinishedAt { get; set; }
    public TimeSpan Timeout => FinishedAt - DateTime.Now;

    [JsonIgnore]
    public Action Cancel { get; internal set; }
}