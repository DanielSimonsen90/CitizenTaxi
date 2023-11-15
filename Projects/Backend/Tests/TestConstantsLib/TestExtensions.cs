using Business.Models.Payloads;
using DanhoLibrary.NLayer;
using System.Text.Json;
#nullable disable

namespace TestConstantsLib;

public static class TestExtensions
{
    /// <summary>
    /// Clones the <see cref="BaseEntity{TId}"/> object and if <paramref name="newId"/> is not null, sets the new id.
    /// </summary>
    /// <typeparam name="T">Type of <see cref="BaseEntity{TId}"/></typeparam>
    /// <param name="self">The object itself</param>
    /// <param name="newId">Nullable Guid incase a new id for the object is required</param>
    /// <returns>A clone of the object</returns>
    public static T CloneEntity<T>(this T self, Guid? newId = null) where T : BaseEntity<Guid>
    {
        // Using JSON serialization, we can create a deep copy of the object without having to implement ICloneable or similar cloning methods.
        T result = JsonSerializer.Deserialize<T>(JsonSerializer.Serialize(self));

        // If newId is not null, set the new id.
        if (newId is not null) result.Id = (Guid)newId;

        return result;
    }

    /// <summary>
    /// Clones the <see cref="ABaseModifyPayload"/> object and if <paramref name="newId"/> is not null, sets the new id.
    /// </summary>
    /// <typeparam name="T">Type of <see cref="ABaseModifyPayload"/></typeparam>
    /// <param name="self">The object itself</param>
    /// <param name="newId">Nullable Guid incase a new id for the object is required</param>
    /// <returns>A clone of the object</returns>
    public static T ClonePayload<T>(this T self, Guid? newId = null) where T : ABaseModifyPayload
    {
        // Ideally, the two Clone methods should be merged into one, but this is not possible due to the generic constraints (god bless typescript)

        T result = JsonSerializer.Deserialize<T>(JsonSerializer.Serialize(self));
        if (newId is not null) result.Id = (Guid)newId;

        return result;
    }
}
