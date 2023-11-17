using Business.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

// Only used for Swagger testing, so wrapped in #if DEBUG
#if DEBUG
/// <summary>
/// This controller is only used for Swagger testing
/// </summary>
public class LoginsController : BaseController
{
    public LoginsController(UnitOfWork uow) : base(uow) {}

    [HttpGet] public IActionResult GetLogins() => Ok(unitOfWork.Logins.GetAll());
    [HttpDelete("{loginId:Guid}")] public IActionResult DeleteLogin(Guid loginId)
    {
        if (!unitOfWork.Logins.Exists(loginId)) return NotFound();
        unitOfWork.Logins.Delete(loginId);
        return NoContent();
    }
}
#endif
