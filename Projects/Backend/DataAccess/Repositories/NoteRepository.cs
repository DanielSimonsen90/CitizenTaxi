using Common.Entities;
using Common.Entities.User;
using DanhoLibrary.NLayer;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class NoteRepository : BaseRepository<Note, Guid>
{
    public NoteRepository(CitizenTaxiDbContext context) : base(context) { }

    public Note? GetFromCitizen(Citizen citizen) => Note.RELATIONS
        .Aggregate(_dbSet.AsQueryable(), (current, relation) => current.Include(relation))
        .FirstOrDefault(note => note.Citizen.Id == citizen.Id);
}
