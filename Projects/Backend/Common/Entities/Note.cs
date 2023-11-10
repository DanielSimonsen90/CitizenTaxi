using Common.Entities.User;
using Common.Enums;
using DanhoLibrary.NLayer;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq.Expressions;

namespace Common.Entities;

/// <summary>
/// Note entity for <see cref="Citizen"/>.
/// The class extends <see cref="BaseEntity{TKey}"/> with a <see cref="Guid"/> as the primary key.
/// <see cref="BaseEntity{TId}"/> is a class from my external library, DanhoLibrary.NLayer, that ensures a TId Id for Primary key.
/// The primary key for this a <see cref="Guid"/> because it is the most flexible primary key.
/// </summary>
public class Note : BaseEntity<Guid>
{
    /// <summary>
    /// Relations to include when getting a note from the database.
    /// </summary>
    public static readonly Expression<Func<Note, object?>>[] RELATIONS =
    {
        note => note.Citizen,
    };

    // Overloading constructor to satisfy EntityFramework in creating models using Migrations.
    public Note() : this(false, "", CarHeight.Any, HelpingUtil.None, Companion.Alone, Follow.No) {}
    // Ignoring Citizen instanciation because it is not required to create a note, but it is required in the database.
    public Note(bool pensioner, string residence,
        CarHeight carHeight, HelpingUtil helpingUtil,
        Companion companion, Follow follow)
    {
        Pensioner = pensioner;
        Residence = residence;
        CarHeight = carHeight;
        HelpingUtil = helpingUtil;
        Companion = companion;
        Follow = follow;
    }

    // Defining foreign key relationship to Citizen.
    [ForeignKey(nameof(Citizen))]
    public Guid CitizenId { get; set; }
    public Citizen Citizen { get; set; }

    /// <summary>
    /// Is the citizen a pensioner?
    /// </summary>
    public bool Pensioner { get; set; }
    /// <summary>
    /// Where does the citizen live?
    /// </summary>
    public string Residence { get; set; }
    /// <summary>
    /// What is the citizen's preferred car height?
    /// </summary>
    public CarHeight CarHeight { get; set; }
    /// <summary>
    /// Does the citizen need a helping utility i.e. a wheelchair?
    /// </summary>
    public HelpingUtil HelpingUtil { get; set; }
    /// <summary>
    /// Does the citizen bring a companion?
    /// </summary>
    public Companion Companion { get; set; }
    /// <summary>
    /// Does the citizen want to be followed to or from the car?
    /// </summary>
    public Follow Follow { get; set; }
}
