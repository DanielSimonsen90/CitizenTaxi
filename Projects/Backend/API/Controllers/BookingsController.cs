using Business.Models.Payloads;
using Business.Services;
using Common.DTOs;
using Common.Entities;
using Common.Entities.User;
using DanhoLibrary.NLayer;
using DataAccess.Repositories;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

namespace API.Controllers;

public class BookingsController : BaseController
{
    public BookingsController(UnitOfWork uow) : base(uow) {}

    [HttpPost] public async Task<IActionResult> CreateBooking([FromBody] BookingModifyPayload payload) => 
        await CreateEntity(payload, uow.Bookings);
    [HttpGet] public async Task<IActionResult> GetBookings([FromQuery] Guid? citizenId)
    {
        if (citizenId is null) return await Task.FromResult(Ok(uow.Bookings.GetAll().Adapt<List<BookingDTO>>()));

        try
        {
            Citizen citizen = uow.Citizens.GetWithRelations(citizenId.Value);
            return await Task.FromResult(Ok(uow.Bookings.GetFromCitizen(citizen).Adapt<List<BookingDTO>>()));
        }
        catch (EntityNotFoundException<Citizen, Guid> ex) { return NotFound(ex.Message); }
    }
    [HttpGet("{bookingId:Guid}")] public async Task<IActionResult> GetBooking([FromRoute] Guid bookingId) => 
        await GetEntity<BookingDTO, Booking, BookingRepository>(bookingId, uow.Bookings, Booking.RELATIONS);
    [HttpPut("{bookingId:Guid}")] public async Task<IActionResult> UpdateBooking([FromRoute] Guid bookingId, [FromBody] BookingModifyPayload payload) => 
        await UpdateEntity<BookingModifyPayload, Booking, BookingRepository>(bookingId, payload, uow.Bookings);
    [HttpDelete("{bookingId:Guid}")] public async Task<IActionResult> DeleteBooking([FromRoute] Guid bookingId) =>
        await DeleteEntity<Booking, BookingRepository>(bookingId, uow.Bookings);
}
