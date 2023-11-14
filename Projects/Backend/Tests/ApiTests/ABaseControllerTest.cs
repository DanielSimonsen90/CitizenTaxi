using API.Controllers;
using Business.Models.Payloads;
using Business.Services;
using DataAccess;
using Common.DTOs;

using DanhoLibrary.NLayer;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Routing.Tree;
using Microsoft.AspNetCore.Http.Metadata;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Linq.Expressions;
using TestConstantsLib;
using Mapster;
using System.Reflection.Emit;

namespace ApiTests;

internal abstract class ABaseControllerTest<TEntity, TDTO, TModifyPayload, TRepository>
    where TEntity : BaseEntity<Guid>, new()
    where TDTO : ABaseDTO
    where TModifyPayload : ABaseModifyPayload
    where TRepository : BaseRepository<TEntity, Guid>
{
    internal Mock<UnitOfWork> UnitOfWorkMock { get; set; }
    protected BaseController controller;
    protected abstract TRepository Repository { get; }

    [SetUp]
    public void Setup()
    {
        CitizenTaxiDbContext context = new(new DbContextOptionsBuilder<CitizenTaxiDbContext>()
            .UseInMemoryDatabase("ControllerTest")
            .Options);
        UnitOfWorkMock = new Mock<UnitOfWork>(context);
        controller = CreateController(UnitOfWorkMock.Object);
    }
    protected abstract BaseController CreateController(UnitOfWork uow);

    [Test] 
    public abstract Task CreateEntity();
    protected async Task CreateEntity(TModifyPayload payload)
    {
        // Act
        IActionResult expectCreatedResult = await controller.CreateEntity(payload, Repository);

        payload.Id = Guid.NewGuid();
        IActionResult payloadWithIdReturnsBadRequest = await controller.CreateEntity(payload, Repository);
        
        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(expectCreatedResult, Is.InstanceOf<CreatedResult>());
            Assert.That(payloadWithIdReturnsBadRequest, Is.InstanceOf<BadRequestObjectResult>());
        });
    }

    [Test]
    public abstract Task GetEntities();

    [Test]
    public abstract Task GetEntity();   
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
            Assert.That(expectedOkResult, Is.InstanceOf<OkObjectResult>());
            Assert.That(expectedNotFoundResult, Is.InstanceOf<NotFoundObjectResult>());
        });
    }

    [Test]
    public abstract Task UpdateEntity();
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
            Assert.That(expectBadRequestByNoId, Is.InstanceOf<BadRequestObjectResult>());
            Assert.That(expectBadRequestByIdMismatch, Is.InstanceOf<BadRequestObjectResult>());
            Assert.That(expectBadRequestByInvalidId, Is.InstanceOf<BadRequestObjectResult>());
            Assert.That(expectNoContentResult, Is.InstanceOf<NoContentResult>());
        });
    }

    [Test]
    public abstract Task DeleteEntity();
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
            Assert.That(expectNotFoundResult, Is.InstanceOf<NotFoundObjectResult>());
            Assert.That(expectNoContentResult, Is.InstanceOf<NoContentResult>());
        });
    }

    protected Task<int> SaveChangesAsync() => UnitOfWorkMock.Object.SaveChangesAsync();
    protected static T GetValueFromResult<T>(IActionResult result)
    {
        if (result is not OkObjectResult okResult) throw new ArgumentException("Result is not an OkObjectResult");
        if (okResult.Value is not T value) throw new ArgumentException("Value is not of type T");
        return value;
    }
}
