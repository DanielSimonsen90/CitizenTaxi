#nullable disable
namespace Common.DTOs;

/// <summary>
/// All DTOs inherit from this class.
/// The class includes <see cref="Id"/> as a nullable <see cref="Guid"/> to ensure that all DTOs may have an Id.
/// This is useful for when the DTO is used in a PUT request, where the Id is required.
/// </summary>
public abstract class ABaseDTO
{
    public Guid? Id { get; set; }
}
