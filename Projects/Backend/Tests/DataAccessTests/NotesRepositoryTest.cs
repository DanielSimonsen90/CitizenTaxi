using TestConstantsLib;
using DataAccess.Repositories;
using Common.Entities;

namespace DataAccessTests;

internal class NotesRepositoryTest : ABaseRepositoryTest<Note, NoteRepository>
{
    /// <summary>
    /// Set repository to <see cref="UnitOfWork.Notes"/>
    /// </summary>
    protected override NoteRepository Repository => UnitOfWork.Notes;

    /// <summary>
    /// Update the entity for <see cref="ABaseRepositoryTest{TEntity, TRepository}.Update()"/>
    /// </summary>
    /// <param name="entity">The entity to update</param>
    /// <returns>The updated entity</returns>
    protected override Note Update(Note entity)
    {
        entity.Pensioner = true;
        return entity;
    }

    /// <summary>
    /// Testing <see cref="NoteRepository.GetFromCitizen(Citizen)"/>
    /// </summary>
    [Test]
    public void GetNoteFromCitizen()
    {
        // Arrange
        var a = TestConstants.TEST_CITIZEN.CloneEntity();
        var b = TestConstants.TEST_CITIZEN.CloneEntity(Guid.NewGuid()); // Clone the test entity but assign new id
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
            Assert.That(resultA, Is.Not.Null, "Note from citizen can be retrieved");
            Assert.That(resultA!.Id, Is.EqualTo(note.Id), "Note returned is the correct note");
            Assert.That(resultB, Is.Null, "Note cannot be received from non-existing citizen");
        });
    }
}
