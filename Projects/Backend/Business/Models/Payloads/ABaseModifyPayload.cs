namespace Business.Models.Payloads;

/// <summary>
/// Base class for all modify payloads.
/// This class includes <see cref="Id"/> as a nullable <see cref="Guid"/> to ensure that all modify payloads may have an Id.
/// </summary>
public class ABaseModifyPayload
{
    public Guid? Id { get; set; }
}
