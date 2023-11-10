using Business.Models.Payloads;
using Business.Services;
using Common.DTOs;
using DanhoLibrary.NLayer;
using Mapster;
using Microsoft.AspNetCore.Mvc;

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
    protected async Task<IActionResult> GetEntity<TDTO>(Guid id, BaseRepository<BaseEntity<Guid>, Guid> repository)
    {
        try { return Ok((await repository.GetAsync(id)).Adapt<TDTO>()); }
        catch (ArgumentException ex) { return BadRequest($"Invalid argument provided: {ex.Message}"); }
        catch (EntityNotFoundException<BaseEntity<Guid>, Guid> ex) { return NotFound($"Entity not found: {ex.Message}"); }
        catch (Exception) { return InternalServerError(); }
    }
    protected async Task<IActionResult> UpdateEntity<TPayload, TRepository>(TPayload payload, TRepository repository)
        where TPayload : ABaseModifyPayload
        where TRepository : BaseRepository<BaseEntity<Guid>, Guid>
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (payload.Id is null || payload.Id == Guid.Empty) return BadRequest("Invalid id provided");

            var entity = await repository.GetAsync(payload.Id.Value);
            repository.Update(entity);
            await uow.SaveChangesAsync();

            return NoContent();
        }
        catch (ArgumentNullException ex) { return BadRequest($"Invalid argument provided: {ex.Message}"); }
        catch (EntityNotFoundException<BaseEntity<Guid>, Guid> ex) { return NotFound($"Entity not found: {ex.Message}"); }
        catch (Exception) { return InternalServerError(); }
    }

    protected async Task<IActionResult> DeleteEntity(Guid id, BaseRepository<BaseEntity<Guid>, Guid> repository)
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
