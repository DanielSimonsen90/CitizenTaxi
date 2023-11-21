using Business.Helpers;
using Common.Entities.User;
using Common.Entities;
using DanhoLibrary.Extensions;

namespace Business.Services;

public class NotificationService
{
    private readonly CacheService _cacheService;

    /// <summary>
    /// This should be replaced in the constructor of <see cref="Hubs.NotificationHub"/>.
    /// </summary>
    private Func<string, string[], Task> _sendNotification = (message, connectionIds) => Task.CompletedTask;
    private readonly List<Action> _cancels = new();

    public NotificationService(CacheService cacheService)
    {
        _cacheService = cacheService;
        cacheService.Bookings.BookingUpsert += OnBookingUpserted;
    }

    public void Reset(Func<string, string[], Task> sendNotification)
    {
        _cancels.ForEach(cancel => cancel());
        _cancels.Clear();

        _sendNotification = sendNotification;
    }

    /// <summary>
    /// When the day changes, reset the bookings cache and start a timer for each booking that will simulate the taxi arrival.
    /// </summary>
    //private void OnDayChanged()
    //{
    //    // Clear the cache
    //    _cacheService.Bookings.Clear();

    //    // Get all bookings that are after now but before tomorrow
    //    IEnumerable<Booking> bookings = _uow?.Bookings.GetAll()
    //        .Where(b => b.Arrival.Date == DateTime.Now.Date) 
    //        ?? Array.Empty<Booking>();

    //    foreach (Booking booking in bookings)
    //    {
    //        var bookingsCache = _cacheService.Bookings;
    //        Guid key = booking.CitizenId;

    //        // Add the bookings to the cache
    //        bookingsCache.Set(key, bookingsCache.ContainsKey(key)
    //            ? bookingsCache[key].Append(booking)
    //            : new List<Booking> { booking });

    //        // Start a timer for the booking that will simulate the taxi arrival
    //        OnBookingUpserted(key, booking);
    //    }
    //}

    private void OnBookingUpserted(Guid citizenId, Booking booking)
    {
        if (booking.Arrival.Date != DateTime.Now.Date) return;

        TimeSpan timeout = booking.Arrival - DateTime.Now;
        if (timeout < TimeSpan.Zero) return;

        var cancel = BookingTimer.StartTimeout(
            booking.Id.ToString(),
            () => Simulate(booking).Wait(),
            timeout.Minutes >= 5
                ? timeout.Subtract(TimeSpan.FromMinutes(5))
                : timeout);
        _cancels.Add(cancel);
    }

    /// <summary>
    /// Simulate a taxi order for the given <paramref name="booking"/>.
    /// </summary>
    /// <param name="booking">The booking to simulate</param>
    /// <returns></returns>
    private async Task Simulate(Booking booking)
    {
        await OnTaxiTimeUpdated(booking, TimeSpan.FromMinutes(30));

        //int[] minutes = { 15, 10, 5, 5 };
        int[] minutes = { 1, 1, 1, 1 };
        for (int i = 0; i < minutes.Length; i++)
        {
            Thread.Sleep(TimeSpan.FromMinutes(minutes[i]).Milliseconds);

            if (_cacheService.Bookings.ContainsKey(booking.CitizenId)
                && !_cacheService.Bookings[booking.CitizenId].Contains(booking))
                return; // If the booking is no longer in the cache, return

            if (i != minutes.Length - 1) await OnTaxiTimeUpdated(booking, TimeSpan.FromMinutes(minutes[i]));
            else await OnTaxiTimeUpdated(booking, TimeSpan.Zero);
        }

        _cacheService.Bookings.RaiseBookingDeleteEvent(booking.Id);
    }

    /// <summary>
    /// Simualte a taxi order for the given <paramref name="bookingId"/>.
    /// </summary>
    /// <param name="bookingId">Id of the <see cref="Common.Entities.Booking"/> that should be simulated</param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    private async Task OnTaxiTimeUpdated(Booking booking, TimeSpan timeLeft)
    {
        string[] connectionIds = _cacheService.ConnectedUsers
            .Where(kvp => kvp.Value is Citizen citizen && citizen.Id == booking.CitizenId)
            .Select(kvp => kvp.Key)
            .ToArray();

        if (!connectionIds.Any()) return;
        if (timeLeft != TimeSpan.Zero)
        {
            await _sendNotification($"Der er nu {timeLeft.Minutes} minutter tilbage til at din taxa ankommer.", connectionIds);
        }
        else await _sendNotification("Din taxa er nu ankommet.", connectionIds);
    }

    public void Register(Guid citizenId, UnitOfWork uow)
    {
        List<Booking> bookings = uow.Bookings.GetFromCitizenId(citizenId);
        _cacheService.Bookings.Set(citizenId, bookings);

        foreach (Booking booking in bookings.Where(b => b.Arrival - DateTime.Now > TimeSpan.Zero))
        {
            TimeSpan timeout = booking.Arrival - DateTime.Now;

            var cancel = BookingTimer.StartTimeout(
                booking.Id.ToString(),
                () => Simulate(booking).Wait(),
                timeout.Minutes >= 5
                    ? timeout.Subtract(TimeSpan.FromMinutes(5))
                    : timeout);
            _cancels.Add(cancel);
        }
    }
}
