using Business.Models.Payloads;
using Business.Services;
using Common.DTOs;
using Common.Entities.User;
using Common.Enums;
using DanhoLibrary.NLayer;
using DataAccess.Repositories;
using Mapster;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class UsersController : BaseController
{
    public UsersController(UnitOfWork uow) : base(uow) { }

    #region User CRUD
    [HttpPost] public async Task<IActionResult> CreateUser([FromBody] UserModifyPayload payload) => payload.Role switch
    {
        Role.Citizen => await CreateEntity(payload, uow.Citizens),
        Role.Admin => await CreateEntity(payload, uow.Admins),
        _ => BadRequest("Invalid role provided"),
    };

    [HttpGet] public IActionResult GetUsers(Role? role) => role switch
    {
        Role.Citizen => Ok(uow.Citizens.GetAllWithRelations(Citizen.RELATIONS).Adapt<List<CitizenDTO>>()),
        Role.Admin => Ok(uow.Admins.GetAll().Adapt<List<UserDTO>>()),
        null => Ok(new
        {
            Citizens = uow.Citizens.GetAllWithRelations(Citizen.RELATIONS).Adapt<List<CitizenDTO>>(),
            Admins = uow.Admins.GetAll().Adapt<List<UserDTO>>(),
        }),
        _ => BadRequest("Invalid role provided"),
    };

    [HttpGet("{userId:Guid}")] public async Task<IActionResult> GetUser([FromRoute] Guid userId) => 
        IsAdmin(userId)
            ? await GetEntity<UserDTO, Admin, AdminRepository>(userId, uow.Admins)
            : await GetEntity<CitizenDTO, Citizen, CitizenRepository>(userId, uow.Citizens, Citizen.RELATIONS);

    [HttpPut("{userId:Guid}")] public async Task<IActionResult> UpdateUser([FromRoute] Guid userId, [FromBody] UserModifyPayload payload)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        bool isAdmin = IsAdmin(userId);
        if (!isAdmin && payload.Role == Role.Admin) return BadRequest("You cannot change your role");

        return isAdmin
            ? await UpdateEntity<UserModifyPayload, Admin, AdminRepository>(userId, payload, uow.Admins)
            : await UpdateEntity<UserModifyPayload, Citizen, CitizenRepository>(userId, payload, uow.Citizens);
    }

    [HttpDelete("{userId:Guid}")]
    public async Task<IActionResult> DeleteUser([FromRoute] Guid userId) => 
        IsAdmin(userId)
            ? await DeleteEntity<Admin, AdminRepository>(userId, uow.Admins)
            : await DeleteEntity<Citizen, CitizenRepository>(userId, uow.Citizens);
    #endregion

    #region Authenticate
    [HttpPost("authenticate")]
    public IActionResult Authenticate([FromBody] LoginPayload payload)
    {
        throw new NotImplementedException();
    }

    [HttpDelete("authenticate")]
    public IActionResult Logout()
    {
        throw new NotImplementedException();
    }
    #endregion

    private bool IsAdmin(Guid userId)
    {
        try { return uow.Admins.Get(userId) is not null; }
        catch (EntityNotFoundException<Admin, Guid>) { return false; }
    }
}
