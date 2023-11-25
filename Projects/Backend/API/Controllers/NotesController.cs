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
/// Controller for all endpoints related to <see cref="Note"/>.
/// This extends <see cref="BaseController"/> to simplify the code in the methods for basic CRUD operations.
/// </summary>
public class NotesController : BaseController
{
    /// <summary>
    /// Constructor receives <see cref="UnitOfWork"/> through dependency injection.
    /// </summary>
    /// <param name="uow">UnitOfWork used to perform CRUD operations on <see cref="Note"/></param>
    public NotesController(UnitOfWork uow) : base(uow) {}

    /// <summary>
    /// Create a <see cref="Note"/> in the database from the given <paramref name="payload"/>.
    /// This uses the <see cref="BaseController.CreateEntity{TPayload,TEntity}"/> method to DRY up the code.
    /// </summary>
    /// <param name="payload">The payload from the frontend</param>
    /// <returns>HTTP response from <see cref="BaseController.CreateEntity{TPayload, TEntity}(TPayload, BaseRepository{TEntity, Guid})"/></returns>
    [HttpPost] public async Task<IActionResult> CreateNote([FromBody] NoteModifyPayload payload) => 
        await CreateEntity<NoteModifyPayload, NoteDTO, Note>(payload, unitOfWork.Notes);

    /// <summary>
    /// Get all <see cref="Note"/>s from the database. This can be filtered by <paramref name="citizenId"/> to only get notes from a specific <see cref="Citizen"/>.
    /// This uses <see cref="BaseController.GetEntity{TDTO, TEntity, TRepository}(Guid, TRepository, System.Linq.Expressions.Expression{Func{TEntity, object?}}[])"/>
    /// </summary>
    /// <param name="citizenId">Optional citizenId to filter the note results</param>
    /// <returns>HTTP response from containing list of <see cref="Note"/> or any error-related HTTP response</returns>
    [HttpGet] public async Task<IActionResult> GetNotes([FromQuery] Guid? citizenId)
    {
        // If no citizenId is given, return all notes as a list of NoteDTO
        if (citizenId is null) return await Task.FromResult(Ok(unitOfWork.Notes.GetAll().Adapt<List<NoteDTO>>()));

        try
        {
            // If a citizenId is given, get the citizen from the database and return all notes from that citizen as a list of NoteDTO
            Citizen citizen = unitOfWork.Citizens.Get(citizenId.Value);
            return await Task.FromResult(Ok(unitOfWork.Notes.GetFromCitizen(citizen).Adapt<NoteDTO?>()));
        }
        // If the citizen is not found, return a not found response
        catch (EntityNotFoundException<Citizen, Guid> ex) { return NotFound(ex.Message); }
    }

    /// <summary>
    /// Get a <see cref="Note"/> from the database with the given <paramref name="noteId"/>.
    /// This uses <see cref="BaseController.GetEntity{TDTO, TEntity, TRepository}(Guid, TRepository, System.Linq.Expressions.Expression{Func{TEntity, object?}}[])"/>
    /// </summary>
    /// <param name="noteId">Id of the <see cref="Note"/> entity</param>
    /// <returns>HTTP response from containing the <see cref="Note"/> or any error-related HTTP response</returns>
    [HttpGet("{noteId:Guid}")] public async Task<IActionResult> GetNote([FromRoute] Guid noteId) => 
        await GetEntity<NoteDTO, Note, NoteRepository>(noteId, unitOfWork.Notes, Note.RELATIONS);

    /// <summary>
    /// Update a <see cref="Note"/> in the database with the given <paramref name="noteId"/> and <paramref name="payload"/>.
    /// This uses <see cref="BaseController.UpdateEntity{TPayload, TEntity, TRepository}(Guid, TPayload, TRepository, System.Linq.Expressions.Expression{Func{TEntity, object?}}[])"/>
    /// </summary>
    /// <param name="noteId">Id of the <see cref="Note"/> entity</param>
    /// <param name="payload">Received payload from the frontend</param>
    /// <returns>HTTP response from <see cref="BaseController.UpdateEntity{TPayload, TEntity, TRepository}(Guid, TPayload, TRepository, System.Linq.Expressions.Expression{Func{TEntity, object?}}[])"/></returns>
    [HttpPut("{noteId:Guid}")] public async Task<IActionResult> UpdateNote([FromRoute] Guid noteId, [FromBody] NoteModifyPayload payload) =>
        await UpdateEntity<NoteModifyPayload, Note, NoteRepository>(noteId, payload, unitOfWork.Notes);

    /// <summary>
    /// Delete a <see cref="Note"/> from the database with the given <paramref name="noteId"/>.
    /// This uses <see cref="BaseController.DeleteEntity{TEntity, TRepository}(Guid, TRepository)"/>
    /// </summary>
    /// <param name="noteId">Id of the <see cref="Note"/> entity</param>
    /// <returns>HTTP response from <see cref="BaseController.DeleteEntity{TEntity, TRepository}(Guid, TRepository)"/></returns>
    [HttpDelete("{noteId:Guid}")] public async Task<IActionResult> DeleteNote([FromRoute] Guid noteId)
    {
        Citizen? citizen = unitOfWork.Citizens
            .GetAllWithRelations(Citizen.RELATIONS)
            .FirstOrDefault(citizen => citizen.Note?.Id == noteId);

        IActionResult result = await DeleteEntity<Note, NoteRepository>(noteId, unitOfWork.Notes);

        // If the result is not an NoContentResult, return the result
        if (result is not NoContentResult) return result;

        // Delete all bookings associated with the citizen, as bookings can't exist without a citizen note
        citizen?.Bookings.ForEach(unitOfWork.Bookings.Delete);

        // Save changes to the database
        unitOfWork.SaveChanges();
        return result;
    }
        
}
