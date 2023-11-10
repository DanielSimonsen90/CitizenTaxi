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
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] UserModifyPayload payload) => payload.Role switch
    {
        Role.Citizen => await CreateEntity(payload, uow.Citizens),
        Role.Admin => await CreateEntity(payload, uow.Admins),
        _ => BadRequest("Invalid role provided"),
    };

    [HttpGet("{userId:Guid}")]
    public async Task<IActionResult> GetUser([FromRoute] Guid userId) => IsAdmin(userId)
        ? await GetEntity<UserDTO>(userId, uow.Admins.Adapt<BaseRepository<BaseEntity<Guid>, Guid>>())
        : await GetEntity<CitizenDTO>(userId, uow.Citizens.Adapt<BaseRepository<BaseEntity<Guid>, Guid>>());

    [HttpPut("{userId:Guid}")]
    public async Task<IActionResult> UpdateUser([FromRoute] Guid userId, [FromBody] UserModifyPayload payload)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        bool isAdmin = IsAdmin(userId);
        if (!isAdmin && payload.Role == Role.Admin) return BadRequest("You cannot change your role");

        return await UpdateEntity(userId, payload, isAdmin 
            ? uow.Admins.Adapt<BaseRepository<BaseEntity<Guid>, Guid>>()
            : uow.Citizens.Adapt<BaseRepository<BaseEntity<Guid>, Guid>>());
    }

    [HttpDelete("{userId:Guid}")]
    public async Task<IActionResult> DeleteUser([FromRoute] Guid userId)
    {
        return await DeleteEntity(userId, IsAdmin(userId)
            ? uow.Admins.Adapt<BaseRepository<BaseEntity<Guid>, Guid>>()
            : uow.Citizens.Adapt<BaseRepository<BaseEntity<Guid>, Guid>>());
    }
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
        catch (EntityNotFoundException<BaseEntity<Guid>, Guid>) { return false; }
    }
}
