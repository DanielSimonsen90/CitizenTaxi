using Business.Models.Payloads;
using DanhoLibrary.NLayer;
using System.Text.Json;
#nullable disable

namespace TestConstantsLib;

public static class TestExtensions
{
    public static T CloneEntity<T>(this T self, Guid? newId = null) where T : BaseEntity<Guid>
    {
        T result = JsonSerializer.Deserialize<T>(JsonSerializer.Serialize(self));
        if (newId is not null) result.Id = (Guid)newId;

        return result;
    }

    public static T ClonePayload<T>(this T self, Guid? newId = null) where T : ABaseModifyPayload
    {
        T result = JsonSerializer.Deserialize<T>(JsonSerializer.Serialize(self));
        if (newId is not null) result.Id = (Guid)newId;

        return result;
    }
}
