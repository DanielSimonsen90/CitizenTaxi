using Business.Models.Payloads;
using Business.Services;
using Common.DTOs;
using Common.Entities.User;
using DanhoLibrary.NLayer;
using Mapster;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class NotesController : BaseController
{
    public NotesController(UnitOfWork uow) : base(uow) {}

    [HttpPost] public async Task<IActionResult> CreateNote([FromBody] NoteModifyPayload payload) => 
        await CreateEntity(payload, uow.Notes);
    [HttpGet] public async Task<IActionResult> GetNotes([FromQuery] Guid? citizenId)
    {
        if (citizenId is null) return Ok(uow.Notes.GetAll().Adapt<List<NoteDTO>>());

        try
        {
            Citizen citizen = await uow.Citizens.GetAsync(citizenId.Value);
            return Ok(uow.Notes.GetFromCitizen(citizen).Adapt<List<NoteDTO>>());
        }
        catch (EntityNotFoundException<Citizen, Guid> ex) { return NotFound(ex.Message); }
    }
    [HttpGet("{noteId:Guid}")] public async Task<IActionResult> GetNote([FromRoute] Guid noteId) => 
        await GetEntity<NoteDTO>(noteId, uow.Notes.Adapt<BaseRepository<BaseEntity<Guid>, Guid>>());
    [HttpPut("{noteId:Guid}")] public async Task<IActionResult> UpdateNote([FromRoute] Guid noteId, [FromBody] NoteModifyPayload payload) =>
        await UpdateEntity(noteId, payload, uow.Notes.Adapt<BaseRepository<BaseEntity<Guid>, Guid>>());
    [HttpDelete("{noteId:Guid}")] public async Task<IActionResult> DeleteNote([FromRoute] Guid noteId) =>
        await DeleteEntity(noteId, uow.Notes.Adapt<BaseRepository<BaseEntity<Guid>, Guid>>());
}
