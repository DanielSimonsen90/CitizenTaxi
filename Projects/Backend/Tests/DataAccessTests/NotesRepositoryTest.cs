using TestConstantsLib;
using DataAccess.Repositories;
using Common.DTOs;
using Common.Entities;

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
        var a = TestConstants.TEST_CITIZEN.CloneEntity();
        var b = TestConstants.TEST_CITIZEN.CloneEntity(Guid.NewGuid());
        var note = TestConstants.TEST_NOTE.CloneEntity();

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
