using Business.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

#if DEBUG
/// <summary>
/// This controller is only used for Swagger testing
/// </summary>
public class LoginsController : BaseController
{
    public LoginsController(UnitOfWork uow) : base(uow) {}

    [HttpGet] public IActionResult GetLogins() => Ok(unitOfWork.Logins.GetAll());
}
#endif
