using Business.Helpers;
using Business.Models.Payloads;
using Business.Services;
using Common.DTOs;
using Common.Entities;
using Common.Entities.User;
using DanhoLibrary.Extensions;
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
    private readonly CacheService _cacheService;

    /// <summary>
    /// Constructor receives <see cref="UnitOfWork"/> through dependency injection.
    /// </summary>
    /// <param name="uow">UnitOfWork to modify the <see cref="Booking"/> model.</param>
    public BookingsController(UnitOfWork uow, CacheService cacheService) : base(uow) 
    {
        _cacheService = cacheService;
    }

    #region Basic CRUD
    /// <summary>
    /// Create a <see cref="Booking"/> in the database from the given <paramref name="payload"/>.
    /// This uses the <see cref="BaseController.CreateEntity{TPayload,TEntity}"/> method to DRY up the code.
    /// </summary>
    /// <param name="payload">The payload from the frontend</param>
    /// <returns>HTTP response from <see cref="BaseController.CreateEntity{TPayload, TEntity}(TPayload, BaseRepository{TEntity, Guid})"/></returns>
    [HttpPost] 
    public async Task<IActionResult> CreateBooking([FromBody] BookingModifyPayload payload)
    {
        IActionResult result = await CreateEntity<BookingModifyPayload, BookingDTO, Booking>(payload, unitOfWork.Bookings);
        if (result is not CreatedResult createdResult) return result;
        if (createdResult.Value is not BookingDTO bookingDTO) return result;

        // If the booking was created successfully, raise change event for the cache
        Booking booking = bookingDTO.Adapt<Booking>();
        _cacheService.Bookings.RaiseBookingUpsertEvent(payload.CitizenId, booking);

        return result;
    }

    /// <summary>
    /// Get all <see cref="Booking"/>s from the database.
    /// This can be filtered by <paramref name="citizenId"/> to only get bookings from a specific <see cref="Citizen"/>.
    /// </summary>
    /// <param name="citizenId">Optional citizenId to filter the booking results</param>
    /// <returns>HTTP response from containing list of <see cref="Booking"/> or any error-related HTTP response</returns>
    [HttpGet] public async Task<IActionResult> GetBookings([FromQuery] Guid? citizenId)
    {
        // If no citizenId is given, return all bookings as a list of BookingDTO
        if (citizenId is null) return await Task.FromResult(Ok(unitOfWork.Bookings.GetAll().Adapt<List<BookingDTO>>()));

        try
        {
            // If a citizenId is given, get the citizen from the database and return all bookings from that citizen as a list of BookingDTO
            Citizen citizen = unitOfWork.Citizens.GetWithRelations(citizenId.Value);
            return await Task.FromResult(Ok(unitOfWork.Bookings.GetFromCitizen(citizen).Adapt<List<BookingDTO>>()));
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
        await GetEntity<BookingDTO, Booking, BookingRepository>(bookingId, unitOfWork.Bookings, Booking.RELATIONS);

    /// <summary>
    /// Update a <see cref="Booking"/> in the database with the given <paramref name="bookingId"/> and <paramref name="payload"/>.
    /// This uses <see cref="BaseController.UpdateEntity{TPayload, TEntity, TRepository}(Guid, TPayload, TRepository, System.Linq.Expressions.Expression{Func{TEntity, object?}}[])"/>
    /// </summary>
    /// <param name="bookingId">Id of the <see cref="Booking"/> entity</param>
    /// <param name="payload">Received payload from the frontend</param>
    /// <returns>HTTP response from <see cref="BaseController.UpdateEntity{TPayload, TEntity, TRepository}(Guid, TPayload, TRepository, System.Linq.Expressions.Expression{Func{TEntity, object?}}[])"/></returns>
    [HttpPut("{bookingId:Guid}")] 
    public async Task<IActionResult> UpdateBooking([FromRoute] Guid bookingId, [FromBody] BookingModifyPayload payload)
    {
        IActionResult result = await UpdateEntity<BookingModifyPayload, Booking, BookingRepository>(bookingId, payload, unitOfWork.Bookings);
        if (result is not NoContentResult) return result;

        // If the booking was updated successfully, raise change event for the cache
        Booking update = unitOfWork.Bookings.Get(bookingId);
        _cacheService.Bookings.RaiseBookingUpsertEvent(update.CitizenId, update);

        return result;
    }

    /// <summary>
    /// Delete a <see cref="Booking"/> from the database with the given <paramref name="bookingId"/>.
    /// This uses <see cref="BaseController.DeleteEntity{TEntity, TRepository}(Guid, TRepository)"/>
    /// </summary>
    /// <param name="bookingId">Id of the <see cref="Booking"/> entity</param>
    /// <returns>HTTP response from <see cref="BaseController.DeleteEntity{TEntity, TRepository}(Guid, TRepository)"/></returns>
    [HttpDelete("{bookingId:Guid}")] 
    public async Task<IActionResult> DeleteBooking([FromRoute] Guid bookingId)
    {
        IActionResult result = await DeleteEntity<Booking, BookingRepository>(bookingId, unitOfWork.Bookings);
        if (result is not NoContentResult) return result;

        // If the booking was deleted successfully, raise change event for the cache
        _cacheService.Bookings.RaiseBookingDeleteEvent(bookingId);

        return result;
    }
    #endregion

    [HttpGet("cache")]
    public IActionResult GetCache() => Ok(_cacheService.Bookings.ToArray().Map(kvp =>
    {
        return new KeyValuePair<Guid, IEnumerable<BookingDTO>>(kvp.Key, kvp.Value.Adapt<List<BookingDTO>>());
    }));
    [HttpGet("timeouts")]
    public IActionResult GetTimeouts() => Ok(BookingTimer.TimeoutsStarted);
}
