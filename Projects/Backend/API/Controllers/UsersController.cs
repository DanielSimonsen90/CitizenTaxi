using Business.Exceptions;
using Business.Models;
using Business.Models.Payloads;
using Business.Services;
using Common.DTOs;
using Common.Entities;
using Common.Entities.User;
using Common.Enums;
using DanhoLibrary.NLayer;
using DataAccess.Repositories;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace API.Controllers;

/// <summary>
/// Controller for all endpoints related to <see cref="Citizen"/> and <see cref="Admin"/>.
/// This is in the same controller because they are both users, and the only main difference is the role.
/// 
/// This class extends <see cref="BaseController"/> to simplify the code in the methods for basic CRUD operations.
/// </summary>
public class UsersController : BaseController
{
    private readonly LoginService _loginService;

    /// <summary>
    /// Constructor receives <see cref="UnitOfWork"/> through dependency injection.
    /// </summary>
    /// <param name="uow">UnitOfWork used to perform CRUD operations on <see cref="Citizen"/> and <see cref="Admin"/></param>
    public UsersController(UnitOfWork uow, LoginService loginService) : base(uow) 
    { 
        _loginService = loginService;
    }

    #region User CRUD
    /// <summary>
    /// Create a <see cref="Citizen"/> or <see cref="Admin"/> in the database from the given <paramref name="payload"/>.
    /// The <paramref name="payload"/> must contain a <see cref="Role"/> to determine which entity to create.
    /// This uses the <see cref="BaseController.CreateEntity{TPayload,TEntity}"/> method to DRY up the code.
    /// </summary>
    /// <param name="payload">The payload from the frontend</param>
    /// <returns>HTTP response from <see cref="BaseController.CreateEntity{TPayload, TEntity}(TPayload, BaseRepository{TEntity, Guid})"/></returns>
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] UserModifyPayload payload)
    {
        // Create user based on the role of the payload using BaseController.CreateEntity
        IActionResult result = payload.Role switch
        {
            Role.Citizen => await CreateEntity(payload, unitOfWork.Citizens),
            Role.Admin => await CreateEntity(payload, unitOfWork.Admins),
            _ => BadRequest("Invalid role provided"),
        };

        // If the result is not an OkObjectResult, return the result
        if (result is not OkObjectResult okResult) return result;
        
        // Receive the created user from the result and create a login for the user
        AUser user = okResult.Value as AUser ?? throw new Exception("User was null");
        string salt = LoginService.GenerateSalt();
        Login login = new(payload.Username, 
            LoginService.GenerateEncrypedPassword(payload.Password, salt), 
            salt, user);
        
        // Add the login to the database and save changes
        unitOfWork.Logins.Add(login);
        await unitOfWork.SaveChangesAsync();
        
        // Return the result
        return result;
    }

    /// <summary>
    /// Get all <see cref="Citizen"/>s and <see cref="Admin"/>s from the database.
    /// This can be filtered by <paramref name="role"/> to only get users with a specific role.
    /// </summary>
    /// <param name="role">Optional role to filter the user results</param>
    /// <returns>HTTP response from containing list of <see cref="Citizen"/> or <see cref="Admin"/> or any error-related HTTP response</returns>
    [HttpGet] public IActionResult GetUsers(Role? role) => role switch
    {
        // Role of the payload determines which entity to get and which repository to use.
        // If no role is given, return all users as a list of UserDTO
        Role.Citizen => Ok(unitOfWork.Citizens.GetAllWithRelations(Citizen.RELATIONS).Adapt<List<CitizenDTO>>()),
        Role.Admin => Ok(unitOfWork.Admins.GetAll().Adapt<List<UserDTO>>()),
        null => Ok(new
        {
            Citizens = unitOfWork.Citizens.GetAllWithRelations(Citizen.RELATIONS).Adapt<List<CitizenDTO>>(),
            Admins = unitOfWork.Admins.GetAll().Adapt<List<UserDTO>>(),
        }),
        // If the role is not valid, return a bad request
        _ => BadRequest("Invalid role provided"),
    };

    /// <summary>
    /// Get a <see cref="Citizen"/> or <see cref="Admin"/> from the database with the given <paramref name="userId"/>.
    /// This uses <see cref="BaseController.GetEntity{TDTO, TEntity, TRepository}(Guid, TRepository, System.Linq.Expressions.Expression{Func{TEntity, object?}}[])"/>
    /// </summary>
    /// <param name="userId">Id of the <see cref="Citizen"/> or <see cref="Admin"/> entity</param>
    /// <returns>HTTP response from containing the <see cref="Citizen"/> or <see cref="Admin"/> or any error-related HTTP response</returns>
    [HttpGet("{userId:Guid}")] public async Task<IActionResult> GetUser([FromRoute] Guid userId) => 
        // Role of the payload determines which entity to get and which repository to use.
        // This is checked by the IsAdmin method.
        IsAdmin(userId)
            ? await GetEntity<UserDTO, Admin, AdminRepository>(userId, unitOfWork.Admins)
            : await GetEntity<CitizenDTO, Citizen, CitizenRepository>(userId, unitOfWork.Citizens, Citizen.RELATIONS);

    /// <summary>
    /// Update a <see cref="Citizen"/> or <see cref="Admin"/> in the database with the given <paramref name="userId"/> and <paramref name="payload"/>.
    /// This uses <see cref="BaseController.UpdateEntity{TPayload, TEntity, TRepository}(Guid, TPayload, TRepository, System.Linq.Expressions.Expression{Func{TEntity, object?}}[])"/>
    /// </summary>
    /// <param name="userId">Id of the <see cref="Citizen"/> or <see cref="Admin"/> entity</param>
    /// <param name="payload">Received payload from the frontend</param>
    /// <returns>HTTP response from <see cref="BaseController.UpdateEntity{TPayload, TEntity, TRepository}(Guid, TPayload, TRepository, System.Linq.Expressions.Expression{Func{TEntity, object?}}[])"/></returns>
    [HttpPut("{userId:Guid}")] public async Task<IActionResult> UpdateUser([FromRoute] Guid userId, [FromBody] UserModifyPayload payload)
    {
        // If the payload is not valid, return a bad request with the ModelState, so the frontend can see what is wrong
        if (!ModelState.IsValid) return BadRequest(ModelState);

        // Check if user tries to change their own role. If so, return a bad request
        bool isAdmin = IsAdmin(userId);
        if (!isAdmin && payload.Role == Role.Admin) return BadRequest("You cannot change your role");

        // Process the update request
        return isAdmin
            ? await UpdateEntity<UserModifyPayload, Admin, AdminRepository>(userId, payload, unitOfWork.Admins)
            : await UpdateEntity<UserModifyPayload, Citizen, CitizenRepository>(userId, payload, unitOfWork.Citizens);
    }

    /// <summary>
    /// Delete a <see cref="Citizen"/> or <see cref="Admin"/> from the database with the given <paramref name="userId"/>.
    /// This uses <see cref="BaseController.DeleteEntity{TEntity, TRepository}(Guid, TRepository)"/>
    /// </summary>
    /// <param name="userId">Id of the <see cref="Citizen"/> or <see cref="Admin"/> entity</param>
    /// <returns>HTTP response from <see cref="BaseController.DeleteEntity{TEntity, TRepository}(Guid, TRepository)"/></returns>
    [HttpDelete("{userId:Guid}")]
    public async Task<IActionResult> DeleteUser([FromRoute] Guid userId) => 
        // Role of the payload determines which entity to delete and which repository to use.
        IsAdmin(userId)
            ? await DeleteEntity<Admin, AdminRepository>(userId, unitOfWork.Admins)
            : await DeleteEntity<Citizen, CitizenRepository>(userId, unitOfWork.Citizens);
    #endregion

    #region Authenticate
    /// <summary>
    /// Adds <see cref="AuthTokens"/> instance using <see cref="AuthService"/>
    /// </summary>
    /// <param name="payload">Login details</param>
    /// <returns>User id to fetch logged-in user</returns>
    [HttpPost("authenticate")]
    public IActionResult Authenticate([FromBody] LoginPayload payload)
    {
        try
        {
            bool isValid = _loginService.TryLogin(payload);
            if (!isValid) return BadRequest("Invalid credentials");

            Login? login = unitOfWork.Logins.GetLoginByUsername(payload.Username);
            if (login is null) return InternalServerError($"Login model was null when looking for username {payload.Username}.");

            AuthService.GenerateTokensAndSaveToCookies(login.UserId, Response);

            return Ok(login.UserId);
        }
        catch (TooManyLoginAttemptsException ex)
        {
            return TooManyRequests(ex.Message);
        }
    }

    /// <summary>
    /// Removes <see cref="AuthTokens"/> instance using <see cref="AuthService"/>
    /// </summary>
    /// <returns></returns>
    [HttpDelete("authenticate")]
    public IActionResult Logout()
    {
        AuthService.RemoveCookie(Request, Response);
        return Ok();
    }
    #endregion

    /// <summary>
    /// Check if the given <paramref name="userId"/> is an <see cref="Admin"/>.
    /// This is done by checking if the <paramref name="userId"/> exists in the <see cref="Admin"/> repository.
    /// </summary>
    /// <param name="userId">Id of the <see cref="Citizen"/> or <see cref="Admin"/> entity</param>
    /// <returns>True if the <paramref name="userId"/> is an <see cref="Admin"/>, false if not</returns>
    private bool IsAdmin(Guid userId)
    {
        // Try to get the admin from the database. If it exists, return true, else return false
        // This throws custom EntityNotFoundException from DanhoLibrary.NLayer if the entity is not found
        try { return unitOfWork.Admins.Get(userId) is not null; }
        catch (EntityNotFoundException<Admin, Guid>) { return false; }
    }
}
