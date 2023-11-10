using Common.Entities;
using Common.Entities.User;
using DanhoLibrary.NLayer;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class NoteRepository : BaseRepository<Note, Guid>
{
    public NoteRepository(CitizenTaxiDbContext context) : base(context) { }

    public Note? GetFromCitizen(Citizen citizen) => _dbSet
        .Include(note => note.Citizen)
        .FirstOrDefault(note => note.Citizen.Id == citizen.Id);
}
