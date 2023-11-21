using Common.Entities;
using DanhoLibrary.Extensions;

namespace Business.Helpers;

public class BookingCache : Dictionary<Guid, IEnumerable<Booking>>
{
    public BookingCache()
    {
        BookingUpsert += OnBookingUpserted;
        BookingDelete += OnBookingDeleted;
    }

    public event Action<Guid, Booking> BookingUpsert;
    public void RaiseBookingUpsertEvent(Guid citizenId, Booking booking) => BookingUpsert(citizenId, booking);
    private void OnBookingUpserted(Guid citizenId, Booking booking)
    {
        OnBookingDeleted(booking.Id);
        this.Set(citizenId, ContainsKey(citizenId)
            ? this[citizenId].Append(booking)
            : new List<Booking> { booking });
    }

    public event Action<Guid> BookingDelete;
    public void RaiseBookingDeleteEvent(Guid bookingId) => BookingDelete(bookingId);
    private void OnBookingDeleted(Guid bookingId)
    {
        KeyValuePair<Guid, IEnumerable<Booking>> kvp = this
            .FirstOrDefault(kvp => kvp.Value.Any(booking => booking.Id == bookingId));

        this.Set(kvp.Key, kvp.Value.Where(b => b.Id != bookingId)); // Remove the booking from the cache
    }
}
