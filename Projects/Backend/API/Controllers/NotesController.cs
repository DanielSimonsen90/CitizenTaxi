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

public class NotesController : BaseController
{
    public NotesController(UnitOfWork uow) : base(uow) {}

    [HttpPost] public async Task<IActionResult> CreateNote([FromBody] NoteModifyPayload payload) => 
        await CreateEntity(payload, uow.Notes);
    [HttpGet] public async Task<IActionResult> GetNotes([FromQuery] Guid? citizenId)
    {
        if (citizenId is null) return await Task.FromResult(Ok(uow.Notes.GetAll().Adapt<List<NoteDTO>>()));

        try
        {
            Citizen citizen = uow.Citizens.Get(citizenId.Value);
            return await Task.FromResult(Ok(uow.Notes.GetFromCitizen(citizen).Adapt<NoteDTO?>()));
        }
        catch (EntityNotFoundException<Citizen, Guid> ex) { return NotFound(ex.Message); }
    }
    [HttpGet("{noteId:Guid}")] public async Task<IActionResult> GetNote([FromRoute] Guid noteId) => 
        await GetEntity<NoteDTO, Note, NoteRepository>(noteId, uow.Notes, Note.RELATIONS);
    [HttpPut("{noteId:Guid}")] public async Task<IActionResult> UpdateNote([FromRoute] Guid noteId, [FromBody] NoteModifyPayload payload) =>
        await UpdateEntity<NoteModifyPayload, Note, NoteRepository>(noteId, payload, uow.Notes);
    [HttpDelete("{noteId:Guid}")] public async Task<IActionResult> DeleteNote([FromRoute] Guid noteId) =>
        await DeleteEntity<Note, NoteRepository>(noteId, uow.Notes);
}
