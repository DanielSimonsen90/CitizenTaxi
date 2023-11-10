using Common.Entities;
using Common.Entities.User;
using DanhoLibrary.NLayer;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

/// <summary>
/// Repository for <see cref="Note"/>.
/// This class extends <see cref="BaseRepository{TEntity, TId}"/> from my external library, DanhoLibrary.NLayer.
/// <see cref="BaseRepository{TEntity, TId}"/> contains many different kinds of CRUD related methods, so this class does not need to implement any "basic" CRUD operations.
/// </summary>
public class NoteRepository : BaseRepository<Note, Guid>
{
    public NoteRepository(CitizenTaxiDbContext context) : base(context) { }

    /// <summary>
    /// Gets <see cref="Note"/> relation from <see cref="Citizen"/>
    /// </summary>
    /// <param name="citizen">The citizen to get the note from</param>
    /// <returns>Note found from <paramref name="citizen"/>, null if none</returns>
    public Note? GetFromCitizen(Citizen citizen) => Note.RELATIONS
        .Aggregate(_dbSet.AsQueryable(), (current, relation) => current.Include(relation))
        .FirstOrDefault(note => note.Citizen.Id == citizen.Id);
}
