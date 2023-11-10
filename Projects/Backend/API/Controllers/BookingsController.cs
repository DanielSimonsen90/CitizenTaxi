using Business.Models.Payloads;
using Business.Services;
using Common.DTOs;
using Common.Entities.User;
using DanhoLibrary.NLayer;
using Mapster;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BookingsController : BaseController
{
    public BookingsController(UnitOfWork uow) : base(uow) {}

    [HttpPost] public async Task<IActionResult> CreateBooking([FromBody] BookingModifyPayload payload) => 
        await CreateEntity(payload, uow.Bookings);
    [HttpGet] public async Task<IActionResult> GetBookings([FromQuery] Guid? citizenId)
    {
        if (citizenId is null) return Ok(uow.Bookings.GetAll().Adapt<List<BookingDTO>>());

        try
        {
            Citizen citizen = await uow.Citizens.GetAsync(citizenId.Value);
            return Ok(uow.Bookings.GetFromCitizen(citizen).Adapt<List<BookingDTO>>());
        }
        catch (EntityNotFoundException<Citizen, Guid> ex) { return NotFound(ex.Message); }
    }
    [HttpGet("{bookingId:Guid}")] public async Task<IActionResult> GetBooking([FromRoute] Guid bookingId) => 
        await GetEntity<BookingDTO>(bookingId, uow.Bookings.Adapt<BaseRepository<BaseEntity<Guid>, Guid>>());
    [HttpPut("{bookingId:Guid}")] public async Task<IActionResult> UpdateBooking([FromRoute] Guid bookingId, [FromBody] BookingModifyPayload payload) => 
        await UpdateEntity(bookingId, payload, uow.Bookings.Adapt<BaseRepository<BaseEntity<Guid>, Guid>>());
    [HttpDelete("{bookingId:Guid}")] public async Task<IActionResult> DeleteBooking([FromRoute] Guid bookingId) => 
        await DeleteEntity(bookingId, uow.Bookings.Adapt<BaseRepository<BaseEntity<Guid>, Guid>>());
}
