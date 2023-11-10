using Business.Models.Payloads;
using Business.Services;
using Common.DTOs;
using DanhoLibrary.NLayer;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using System.Linq.Expressions;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseController : ControllerBase
{
    protected readonly UnitOfWork uow;

    protected BaseController(UnitOfWork uow)
    {
        this.uow = uow;
    }

    protected IActionResult InternalServerError() => StatusCode(StatusCodes.Status500InternalServerError);

    protected async Task<IActionResult> CreateEntity<TPayload, TEntity>(TPayload payload, BaseRepository<TEntity, Guid> repository)
        where TEntity : BaseEntity<Guid>
        where TPayload : ABaseModifyPayload
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var entity = payload.Adapt<TEntity>();
            var created = await repository.AddAsync(entity);
            await uow.SaveChangesAsync();

            return Created($"api/[controller]/{created.Id}", created);
        }
        catch (ArgumentNullException ex) { return BadRequest($"Invalid argument provided: {ex.Message}"); }
        catch (ArgumentException ex) { return BadRequest(ex.Message); }
        catch (Exception) { return InternalServerError(); }
    }
    protected async Task<IActionResult> GetEntity<TDTO, TEntity, TRepository>(Guid id, TRepository repository, params Expression<Func<TEntity, object?>>[] relations)
        where TDTO : ABaseDTO
        where TEntity : BaseEntity<Guid>
        where TRepository : BaseRepository<TEntity, Guid>
    {
        try 
        {
            var entity = repository.GetWithRelations(id, relations);
            return entity is null
                ? NotFound($"Entity not found with id: {id}")
                : Ok(entity.Adapt<TDTO>());
        }
        catch (ArgumentException ex) { return BadRequest($"Invalid argument provided: {ex.Message}"); }
        catch (EntityNotFoundException<BaseEntity<Guid>, Guid> ex) { return NotFound($"Entity not found: {ex.Message}"); }
        catch (Exception) { return InternalServerError(); }
    }
    protected async Task<IActionResult> UpdateEntity<TPayload, TEntity, TRepository>(Guid id, TPayload payload, TRepository repository)
        where TPayload : ABaseModifyPayload
        where TEntity : BaseEntity<Guid>
        where TRepository : BaseRepository<TEntity, Guid>
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (payload.Id is null || payload.Id == Guid.Empty) return BadRequest("Invalid id provided");
            if (payload.Id != id) return BadRequest("Id mismatch");

            var entity = await repository.GetAsync(payload.Id.Value);
            repository.Update(entity);
            await uow.SaveChangesAsync();

            return NoContent();
        }
        catch (ArgumentNullException ex) { return BadRequest($"Invalid argument provided: {ex.Message}"); }
        catch (EntityNotFoundException<BaseEntity<Guid>, Guid> ex) { return NotFound($"Entity not found: {ex.Message}"); }
        catch (Exception) { return InternalServerError(); }
    }

    protected async Task<IActionResult> DeleteEntity<TEntity, TRepository>(Guid id, TRepository repository)
        where TEntity : BaseEntity<Guid>
        where TRepository : BaseRepository<TEntity, Guid>
    {
        try
        {
            repository.Delete(id);
            await uow.SaveChangesAsync();
            return NoContent();
        }
        catch (EntityNotFoundException<BaseEntity<Guid>, Guid> ex) { return NotFound($"Entity not found: {ex.Message}"); }
        catch (Exception) { return InternalServerError(); }
    }   
}
