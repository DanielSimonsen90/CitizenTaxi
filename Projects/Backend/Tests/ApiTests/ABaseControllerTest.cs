using TestConstantsLib;
using API.Controllers;
using Business.Models.Payloads;
using Business.Services;
using DataAccess;
using Common.DTOs;

using DanhoLibrary.NLayer;

using Mapster;
using Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ApiTests;

/// <summary>
/// Tests for <see cref="BaseController"/> and its subclasses.
/// </summary>
/// <typeparam name="TEntity">Type of <see cref="BaseEntity{TId}"/></typeparam>
/// <typeparam name="TDTO">Type of <see cref="ABaseDTO"/></typeparam>
/// <typeparam name="TModifyPayload">Type of <see cref="ABaseModifyPayload"/></typeparam>
/// <typeparam name="TRepository"><see cref="BaseRepository{TEntity, TId}"/> for entity</typeparam>
internal abstract class ABaseControllerTest<TEntity, TDTO, TModifyPayload, TRepository>
    where TEntity : BaseEntity<Guid>, new()
    where TDTO : ABaseDTO
    where TModifyPayload : ABaseModifyPayload
    where TRepository : BaseRepository<TEntity, Guid>
{
    /// <summary>
    /// Mocked UnitOfWork for database access.
    /// </summary>
    internal Mock<UnitOfWork> UnitOfWorkMock { get; set; }
    /// <summary>
    /// Controller to test
    /// </summary>
    protected BaseController controller;
    /// <summary>
    /// Repository for CRUD operations
    /// </summary>
    protected abstract TRepository Repository { get; }

    /// <summary>
    /// This method is called before each test, re-creating in-memory database and initializing <see cref="UnitOfWorkMock"/> and <see cref="controller"/>
    /// </summary>
    [SetUp]
    public void Setup()
    {
        CitizenTaxiDbContext context = new(
            new DbContextOptionsBuilder<CitizenTaxiDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options);
        UnitOfWorkMock = new Mock<UnitOfWork>(context);
        controller = CreateController(UnitOfWorkMock.Object);
    }

    /// <summary>
    /// This method is called after each test, disposing the UnitOfWork and releasing the in-memory database and its resources.
    /// </summary>
    [TearDown]
    public void TearDown()
    {
        UnitOfWorkMock.Object.Dispose();
    }

    /// <summary>
    /// Create the controller to test in subclasses.
    /// </summary>
    /// <param name="uow">UnitOfWork for <see cref="BaseController"/> argument</param>
    /// <returns></returns>
    protected abstract BaseController CreateController(UnitOfWork uow);

    /// <summary>
    /// Testing <see cref="BaseController.CreateEntity{TPayload, TEntity}(TPayload, BaseRepository{TEntity, Guid})"/>
    /// This is abstract as the payload is different for each entity and needs to be implemented in subclasses.
    /// </summary>
    [Test]
    public abstract Task CreateEntity();
    /// <summary>
    /// Functionality for <see cref="CreateEntity()"/>
    /// </summary>
    /// <param name="payload">Payload that could be sent from frontend</param>
    protected async Task CreateEntity(TModifyPayload payload)
    {
        // Act
        IActionResult expectCreatedResult = await controller.CreateEntity(payload, Repository);

        payload.Id = Guid.NewGuid();
        IActionResult payloadWithIdReturnsBadRequest = await controller.CreateEntity(payload, Repository);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(expectCreatedResult, Is.InstanceOf<CreatedResult>(), "Creating entity returns 201 Created");
            Assert.That(payloadWithIdReturnsBadRequest, Is.InstanceOf<BadRequestObjectResult>(), "Providing Id to payload returns 400 Bad Request");
        });
    }

    /// <summary>
    /// Testing <see cref="BaseController.GetEntities{TDTO, TEntity, TRepository}(TRepository, Expression{Func{TEntity, object}}[])"/>
    /// This method differs per controller and must be completely implemented from scratch in subclasses.
    /// </summary>
    [Test]
    public abstract Task GetEntities();

    /// <summary>
    /// Testing <see cref="BaseController.GetEntity{TDTO, TEntity, TRepository}(Guid, TRepository, Expression{Func{TEntity, object}}[])"/>
    /// This is abstract as the relations are different for each entity and needs to be implemented in subclasses.
    /// </summary>
    /// <returns></returns>
    [Test]
    public abstract Task GetEntity();
    /// <summary>
    /// Functionality for <see cref="GetEntity()"/>
    /// </summary>
    /// <param name="entity">Entity to add for testing GET operation</param>
    /// <param name="relations">Relations to the entity</param>
    /// <returns></returns>
    protected async Task GetEntity(TEntity entity, params Expression<Func<TEntity, object?>>[] relations)
    {
        // Arrange
        Repository.Add(entity);
        await SaveChangesAsync(); // Save changes to the database

        // Act
        IActionResult expectedOkResult = await controller.GetEntity<TDTO, TEntity, TRepository>(entity.Id, Repository, relations);
        IActionResult expectedNotFoundResult = await controller.GetEntity<TDTO, TEntity, TRepository>(Guid.NewGuid(), Repository, relations);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(expectedOkResult, Is.InstanceOf<OkObjectResult>(), "Getting entity by Id returns 200 Ok with object");
            Assert.That(expectedNotFoundResult, Is.InstanceOf<NotFoundObjectResult>(), "Getting entity by invalid Id returns 404 Not found");
        });
    }

    /// <summary>
    /// Testing <see cref="BaseController.UpdateEntity{TPayload, TEntity, TRepository}(Guid, TPayload, TRepository)"/>
    /// This is abstract as the payload is different for each entity and needs to be implemented in subclasses.
    /// </summary>
    [Test]
    public abstract Task UpdateEntity();
    /// <summary>
    /// Functionality for <see cref="UpdateEntity()"/>
    /// </summary>
    /// <param name="entity"></param>
    /// <param name="update"></param>
    /// <returns></returns>
    protected async Task UpdateEntity(TEntity entity, TModifyPayload update)
    {
        // Arrange
        Repository.Add(entity);
        await SaveChangesAsync();

        update.Id = entity.Id;
        update.Adapt(entity);
        TModifyPayload updateWithBadId = update.ClonePayload(Guid.NewGuid());

        // Act
        IActionResult expectBadRequestByNoId = await controller.UpdateEntity<TModifyPayload, TEntity, TRepository>(Guid.Empty, update, Repository);
        IActionResult expectBadRequestByIdMismatch = await controller.UpdateEntity<TModifyPayload, TEntity, TRepository>(entity.Id, updateWithBadId, Repository);
        IActionResult expectBadRequestByInvalidId = await controller.UpdateEntity<TModifyPayload, TEntity, TRepository>(Guid.NewGuid(), update, Repository);
        IActionResult expectNoContentResult = await controller.UpdateEntity<TModifyPayload, TEntity, TRepository>(entity.Id, update, Repository);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(expectBadRequestByNoId, Is.InstanceOf<BadRequestObjectResult>(), "Payload with no Id returns 400 Bad Request");
            Assert.That(expectBadRequestByIdMismatch, Is.InstanceOf<BadRequestObjectResult>(), "Payload with Id mismatch returns 400 Bad Request");
            Assert.That(expectBadRequestByInvalidId, Is.InstanceOf<BadRequestObjectResult>(), "Payload with Id not in database returns 400 Bad Request");
            Assert.That(expectNoContentResult, Is.InstanceOf<NoContentResult>(), "Updated payload returns 204 No Content");
        });
    }

    /// <summary>
    /// Testing <see cref="BaseController.DeleteEntity{TEntity, TRepository}(Guid, TRepository)"/>
    /// </summary>
    [Test]
    public abstract Task DeleteEntity();
    /// <summary>
    /// Functionality for <see cref="DeleteEntity()"/>
    /// </summary>
    /// <param name="entity">Entity to add for testing delete</param>
    protected async Task DeleteEntity(TEntity entity)
    {
        // Arrange
        Repository.Add(entity);
        await SaveChangesAsync();

        // Act
        IActionResult expectNotFoundResult = await controller.DeleteEntity<TEntity, TRepository>(Guid.NewGuid(), Repository);
        IActionResult expectNoContentResult = await controller.DeleteEntity<TEntity, TRepository>(entity.Id, Repository);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(expectNotFoundResult, Is.InstanceOf<NotFoundObjectResult>(), "Deleting with Id not in database returns 404 Not Found");
            Assert.That(expectNoContentResult, Is.InstanceOf<NoContentResult>(), "Deleting entity returns 201 No content");
        });
    }

    /// <summary>
    /// Shorthand for saving changes to the database.
    /// </summary>
    /// <returns></returns>
    protected Task<int> SaveChangesAsync() => UnitOfWorkMock.Object.SaveChangesAsync();
    /// <summary>
    /// Returns <typeparamref name="T"/> value from <paramref name="result"/>
    /// </summary>
    /// <typeparam name="T">Type of result to expect</typeparam>
    /// <param name="result">Result from controller method</param>
    /// <returns>Value from result</returns>
    /// <exception cref="ArgumentException">If <paramref name="result"/> is not <see cref="OkObjectResult"/> or value is not <typeparamref name="T"/></exception>
    protected static T GetValueFromResult<T>(IActionResult result)
    {
        if (result is not OkObjectResult okResult) throw new ArgumentException("Result is not an OkObjectResult");
        if (okResult.Value is not T value) throw new ArgumentException("Value is not of type T");
        return value;
    }
}
