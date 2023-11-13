using Common.DTOs;
using Common.Entities;
using Common.Entities.User;
using Common.Enums;
using DataAccess.Repositories;
using Microsoft.EntityFrameworkCore.Query.Internal;

namespace DataAccessTests;

internal class NotesRepositoryTest : ABaseRepositoryTest<Note, NoteDTO, NoteRepository>
{
    protected override NoteRepository Repository => UnitOfWork.Notes;
    protected override Note Update(Note entity)
    {
        entity.Pensioner = true;
        return entity;
    }

    [Test]
    public void GetNoteFromCitizen_ReturnsNoteAssociatedWithCitizen()
    {
        // Arrange
        var a = TestConstants.TEST_CITIZEN.Clone();
        var b = TestConstants.TEST_CITIZEN.Clone(Guid.NewGuid());
        var note = TestConstants.TEST_NOTE.Clone();

        a.Note = note;
        UnitOfWork.Citizens.Add(a);
        UnitOfWork.SaveChanges(); // Note should be added to database with citizen

        // Act
        var resultA = Repository.GetFromCitizen(a);
        var resultB = Repository.GetFromCitizen(b);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(resultA, Is.Not.Null);
            Assert.That(resultA!.Id, Is.EqualTo(note.Id));
            Assert.That(resultB, Is.Null);
        });
    }
}
