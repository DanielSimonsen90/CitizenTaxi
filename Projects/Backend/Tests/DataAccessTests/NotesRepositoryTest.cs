using Common.DTOs;
using Common.Entities;
using DataAccess.Repositories;

namespace DataAccessTests;

internal class NotesRepositoryTest : ABaseRepositoryTest<Note, NoteDTO, NoteRepository>
{
    protected override NoteRepository Repository => UnitOfWork.Notes;
    protected override Note Update(Note entity)
    {
        entity.Pensioner = true;
        return entity;
    }
}
