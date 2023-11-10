using Business.Models.Payloads;
using Business.Services;
using Common.DTOs;
using Common.Entities;
using Common.Entities.User;
using DanhoLibrary.NLayer;
using DataAccess.Repositories;
using Mapster;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// Controller for all endpoints related to <see cref="Booking"/>.
/// This class extends <see cref="BaseController"/> to simplify the code in the methods for basic CRUD operations.
/// </summary>
public class BookingsController : BaseController
{
    /// <summary>
    /// Constructor receives <see cref="UnitOfWork"/> through dependency injection.
    /// </summary>
    /// <param name="uow">UnitOfWork to modify the <see cref="Booking"/> model.</param>
    public BookingsController(UnitOfWork uow) : base(uow) {}

    /// <summary>
    /// Create a <see cref="Booking"/> in the database from the given <paramref name="payload"/>.
    /// This uses the <see cref="BaseController.CreateEntity{TPayload,TEntity}"/> method to DRY up the code.
    /// </summary>
    /// <param name="payload">The payload from the frontend</param>
    /// <returns>HTTP response from <see cref="BaseController.CreateEntity{TPayload, TEntity}(TPayload, BaseRepository{TEntity, Guid})"/></returns>
    [HttpPost] public async Task<IActionResult> CreateBooking([FromBody] BookingModifyPayload payload) => 
        await CreateEntity(payload, uow.Bookings);

    /// <summary>
    /// Get all <see cref="Booking"/>s from the database.
    /// This can be filtered by <paramref name="citizenId"/> to only get bookings from a specific <see cref="Citizen"/>.
    /// </summary>
    /// <param name="citizenId">Optional citizenId to filter the booking results</param>
    /// <returns>HTTP response from containing list of <see cref="Booking"/> or any error-related HTTP response</returns>
    [HttpGet] public async Task<IActionResult> GetBookings([FromQuery] Guid? citizenId)
    {
        // If no citizenId is given, return all bookings as a list of BookingDTO
        if (citizenId is null) return await Task.FromResult(Ok(uow.Bookings.GetAll().Adapt<List<BookingDTO>>()));

        try
        {
            // If a citizenId is given, get the citizen from the database and return all bookings from that citizen as a list of BookingDTO
            Citizen citizen = uow.Citizens.GetWithRelations(citizenId.Value);
            return await Task.FromResult(Ok(uow.Bookings.GetFromCitizen(citizen).Adapt<List<BookingDTO>>()));
        }
        // If the citizen is not found, return a not found response
        catch (EntityNotFoundException<Citizen, Guid> ex) { return NotFound(ex.Message); }
    }

    /// <summary>
    /// Get a <see cref="Booking"/> from the database with the given <paramref name="bookingId"/>.
    /// This uses <see cref="BaseController.GetEntity{TDTO, TEntity, TRepository}(Guid, TRepository, System.Linq.Expressions.Expression{Func{TEntity, object?}}[])"/>
    /// </summary>
    /// <param name="bookingId">Id of the <see cref="Booking"/> entity</param>
    /// <returns>HTTP response from containing the <see cref="Booking"/> or any error-related HTTP response</returns>
    [HttpGet("{bookingId:Guid}")] public async Task<IActionResult> GetBooking([FromRoute] Guid bookingId) => 
        await GetEntity<BookingDTO, Booking, BookingRepository>(bookingId, uow.Bookings, Booking.RELATIONS);

    /// <summary>
    /// Update a <see cref="Booking"/> in the database with the given <paramref name="bookingId"/> and <paramref name="payload"/>.
    /// This uses <see cref="BaseController.UpdateEntity{TPayload, TEntity, TRepository}(Guid, TPayload, TRepository, System.Linq.Expressions.Expression{Func{TEntity, object?}}[])"/>
    /// </summary>
    /// <param name="bookingId">Id of the <see cref="Booking"/> entity</param>
    /// <param name="payload">Received payload from the frontend</param>
    /// <returns>HTTP response from <see cref="BaseController.UpdateEntity{TPayload, TEntity, TRepository}(Guid, TPayload, TRepository, System.Linq.Expressions.Expression{Func{TEntity, object?}}[])"/></returns>
    [HttpPut("{bookingId:Guid}")] public async Task<IActionResult> UpdateBooking([FromRoute] Guid bookingId, [FromBody] BookingModifyPayload payload) => 
        await UpdateEntity<BookingModifyPayload, Booking, BookingRepository>(bookingId, payload, uow.Bookings);

    /// <summary>
    /// Delete a <see cref="Booking"/> from the database with the given <paramref name="bookingId"/>.
    /// This uses <see cref="BaseController.DeleteEntity{TEntity, TRepository}(Guid, TRepository)"/>
    /// </summary>
    /// <param name="bookingId">Id of the <see cref="Booking"/> entity</param>
    /// <returns>HTTP response from <see cref="BaseController.DeleteEntity{TEntity, TRepository}(Guid, TRepository)"/></returns>
    [HttpDelete("{bookingId:Guid}")] public async Task<IActionResult> DeleteBooking([FromRoute] Guid bookingId) =>
        await DeleteEntity<Booking, BookingRepository>(bookingId, uow.Bookings);
}
