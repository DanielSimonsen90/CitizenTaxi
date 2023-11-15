using Business.Models.Payloads;
using Business.Services;
using Common.DTOs;
using DanhoLibrary.NLayer;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using System.Linq.Expressions;

namespace API.Controllers;

/// <summary>
/// Base controller for all controllers in the API.
/// This ensures that all API controllers have access to the <see cref="unitOfWork" />, basic CRUD operation and other helpful controller methods like <see cref="InternalServerError"/>.
/// This class extends <see cref="ControllerBase"/> from AspNetCore.Mvc to ensure that all controllers are API controllers.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public abstract class BaseController : ControllerBase
{
    /// <summary>
    /// The <see cref="Business.Services.UnitOfWork"/> used for CRUD operations on the database.
    /// </summary>
    protected readonly UnitOfWork unitOfWork;

    /// <summary>
    /// The constructor receives <see cref="Business.Services.UnitOfWork"/> through dependency injection.
    /// </summary>
    /// <param name="uow">UnitOfWork</param>
    protected BaseController(UnitOfWork uow)
    {
        unitOfWork = uow;
    }

    /// <summary>
    /// By standard, ASP.NET Core does not include a method for internal server error, so this method is used to return a 500 Internal Server Error.
    /// </summary>
    /// <returns></returns>
    protected IActionResult InternalServerError(string message) => StatusCode(StatusCodes.Status500InternalServerError, message);

    #region CRUD Operations
    /// <summary>
    /// Create an entity in the database from the given <paramref name="payload"/> and <paramref name="repository"/>.
    /// </summary>
    /// <typeparam name="TPayload">The payload type</typeparam>
    /// <typeparam name="TEntity">The entity type</typeparam>
    /// <param name="payload">The payload received from the frontend</param>
    /// <param name="repository">The repository to save the entity to</param>
    /// <returns>HTTP result of the operation</returns>
    public async Task<IActionResult> CreateEntity<TPayload, TEntity>(TPayload payload, BaseRepository<TEntity, Guid> repository)
        where TEntity : BaseEntity<Guid> // The entity must be a BaseEntity with a Guid as Id
        where TPayload : ABaseModifyPayload // The payload must be a ABaseModifyPayload
    {
        try
        {
            // If the payload is not valid, return a bad request with the ModelState, so the frontend can see what is wrong
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (payload.Id is not null && payload.Id != Guid.Empty) return BadRequest("Id must be null or empty");

            // Adapt the payload to the entity and save it to the database
            var entity = payload.Adapt<TEntity>();
            var created = await repository.AddAsync(entity);
            await unitOfWork.SaveChangesAsync();

            // Return the created entity
            return Created($"api/[controller]/{created.Id}", created);
        }
        // If any exception is thrown from the AddAsync method, return appropriate HTTP response.
        catch (ArgumentNullException ex) { return BadRequest($"Invalid argument provided: {ex.Message}"); }
        catch (ArgumentException ex) { return BadRequest(ex.Message); }
        // Backup exception in case something else went wrong
        catch (Exception ex) { return InternalServerError(ex.Message); }
    }

    /// <summary>
    /// Get entity from the given <paramref name="repository"/> that matches the given <paramref name="id"/>.
    /// </summary>
    /// <typeparam name="TDTO">Type of the DTO to send</typeparam>
    /// <typeparam name="TEntity">The entity type</typeparam>
    /// <typeparam name="TRepository">The repository type</typeparam>
    /// <param name="id">Id of the entity to find</param>
    /// <param name="repository">Repository to use to find the desired entity</param>
    /// <param name="relations">Additional relations to include when returning the entity</param>
    /// <returns>HTTP response</returns>
    public async Task<IActionResult> GetEntity<TDTO, TEntity, TRepository>(Guid id, TRepository repository, params Expression<Func<TEntity, object?>>[] relations)
        where TDTO : ABaseDTO // The DTO must be a ABaseDTO
        where TEntity : BaseEntity<Guid> // The entity must be a BaseEntity with a Guid as Id
        where TRepository : BaseRepository<TEntity, Guid> // The repository must be a BaseRepository with a Guid as Id
    {
        try 
        {
            // Get the entity from the database
            var entity = repository.GetWithRelations(id, relations);

            // If the entity is null, return a 404 Not Found, otherwise return the entity as a DTO
            return entity is null
                ? await Task.FromResult(NotFound($"Entity not found with id: {id}"))
                : await Task.FromResult(Ok(entity.Adapt<TDTO>()));
        }
        // If any exception is thrown from the GetWithRelations method, return the appropriate HTTP response
        catch (ArgumentException ex) { return BadRequest($"Invalid argument provided: {ex.Message}"); }
        catch (EntityNotFoundException<TEntity, Guid> ex) { return NotFound($"Entity not found: {ex.Message}"); }
        // Backup exception in case something else went wrong
        catch (Exception ex) { return InternalServerError(ex.Message); }
    }

    /// <summary>
    /// Update entity in the given <paramref name="repository"/> that matches the given <paramref name="id"/> with the given <paramref name="payload"/>.
    /// </summary>
    /// <typeparam name="TPayload">The payload type</typeparam>
    /// <typeparam name="TEntity">The entity type</typeparam>
    /// <typeparam name="TRepository">The repository type</typeparam>
    /// <param name="id">Id of the entity to update</param>
    /// <param name="payload">The update from the frontend</param>
    /// <param name="repository">Repository to use to update the entity</param>
    /// <returns>HTTP response</returns>
    public async Task<IActionResult> UpdateEntity<TPayload, TEntity, TRepository>(Guid id, TPayload payload, TRepository repository)
        where TPayload : ABaseModifyPayload // The payload must be a ABaseModifyPayload
        where TEntity : BaseEntity<Guid> // The entity must be a BaseEntity with a Guid as Id
        where TRepository : BaseRepository<TEntity, Guid> // The repository must be a BaseRepository with a Guid as Id
    {
        try
        {
            // If the payload is not valid, return a bad request with the ModelState, so the frontend can see what is wrong
            if (!ModelState.IsValid) return BadRequest(ModelState);
            // If the payload does not have an Id, return a bad request, as the Id is required for PUT requests
            if (payload.Id is null || payload.Id == Guid.Empty) return BadRequest("Invalid id provided");
            // If the payload Id does not match the given id from route, return a bad request for id mismatch
            if (payload.Id != id) return BadRequest("Id mismatch");

            // Check if the entity exists in the database, if not, return a 404 Not Found
            TEntity existing = repository.Get(payload.Id.Value);
            if (existing is null) return NotFound(payload.Id.Value);

            // Update the entity in the database and save changes
            repository.Update(payload.Adapt(existing));
            await unitOfWork.SaveChangesAsync();

            // Return a 204 No Content, as standard for PUT requests
            return NoContent();
        }
        // If any exception is thrown from the Update or Exists method, return the appropriate HTTP response
        catch (ArgumentNullException ex) { return BadRequest($"Invalid argument provided: {ex.Message}"); }
        catch (EntityNotFoundException<TEntity, Guid> ex) { return NotFound($"Entity not found: {ex.Message}"); }
        // Backup exception in case something else went wrong
        catch (Exception ex) { return InternalServerError(ex.Message); }
    }

    /// <summary>
    /// Delete entity from the given <paramref name="repository"/> that matches the given <paramref name="id"/>.
    /// </summary>
    /// <typeparam name="TEntity">The entity type</typeparam>
    /// <typeparam name="TRepository">The repository type</typeparam>
    /// <param name="id">Id of the entity to delete</param>
    /// <param name="repository">The repository to use to delete the entity</param>
    /// <returns>HTTP response</returns>
    public async Task<IActionResult> DeleteEntity<TEntity, TRepository>(Guid id, TRepository repository)
        where TEntity : BaseEntity<Guid> // The entity must be a BaseEntity with a Guid as Id
        where TRepository : BaseRepository<TEntity, Guid> // The repository must be a BaseRepository with a Guid as Id
    {
        try
        {
            // Delete the entity from the database and save changes
            repository.Delete(id);
            await unitOfWork.SaveChangesAsync();
            return NoContent();
        }
        // If the entity was not found or any other exception was thrown, return the appropriate HTTP response
        catch (EntityNotFoundException<TEntity, Guid> ex) { return NotFound($"Entity not found: {ex.Message}"); }
        catch (Exception ex) { return InternalServerError(ex.Message); }
    }
    #endregion
}
