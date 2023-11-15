using Business.Services;
using DataAccess;
using Common.DTOs;

using DanhoLibrary.NLayer;

using Microsoft.EntityFrameworkCore; // Microsoft.EntityFrameworkCore.InMemory

using System.Text.Json;
#nullable disable

namespace DataAccessTests;

/// <summary>
/// This abstract class (also indicated by the "A" prefix) is used to test the <see cref="BaseRepository{TEntity, TId}"/> class from DanhoLibrary.NLayer.
/// All repositories from <see cref="DataAccess.Repositories"/> extend <see cref="BaseRepository{TEntity, TId}"/>, and so hereby the corresponding tests should also extend from this class.
/// The main CRUD operations can be found here.
/// The abstract methods are used to implement the specific tests and properties.
/// </summary>
/// <typeparam name="TEntity">Type of entity to test. This must extend <see cref="BaseEntity{TId}"/></typeparam>
/// <typeparam name="TRepository">Repository type from <see cref="UnitOfWork"/></typeparam>
public abstract class ABaseRepositoryTest<TEntity, TRepository>
    where TEntity : BaseEntity<Guid>, new()
    where TRepository : BaseRepository<TEntity, Guid>
{
    /// <summary>
    /// UnitOfWork for database access.
    /// </summary>
    protected UnitOfWork UnitOfWork { get; set; }
    /// <summary>
    /// Repository containing the <see cref="TEntity"/>
    /// </summary>
    protected abstract TRepository Repository { get; }

    /// <summary>
    /// This method is called before each test, re-creating in-memory database.
    /// </summary>
    [SetUp]
    public void Setup()
    {
        var context = new CitizenTaxiDbContext(
            new DbContextOptionsBuilder<CitizenTaxiDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
        UnitOfWork = new UnitOfWork(context);
    }

    /// <summary>
    /// This method is called after each test, disposing the UnitOfWork and releasing the in-memory database and its resources.
    /// </summary>
    [TearDown]
    public void TearDown()
    {
        UnitOfWork.Dispose();
    }

    /// <summary>
    /// Testing <see cref="BaseRepository{TEntity, TId}.Exists(TId?)"/>
    /// </summary>
    [Test]
    public void Exists()
    {
        // Arrange
        var a = new TEntity();
        var b = new TEntity();

        // Act
        Repository.Add(a);

        var exists = Repository.Exists(a.Id);
        var doesntExist = Repository.Exists(b.Id);

        // Assert   
        Assert.Multiple(() =>
        {
            Assert.That(exists, Is.True, "Exists is true");
            Assert.That(doesntExist, Is.False, "Exists is false");
        });
    }

    /// <summary>
    /// Testing <see cref="BaseRepository{TEntity, TId}.Add(TEntity)"/>
    /// </summary>
    [Test]
    public void Add()
    {
        // Arrange
        var entity = new TEntity();
        var length = Repository.GetAll().Count();

        // Act
        Repository.Add(entity);
        
        // Save changes so entity can be retrieved by GetAll
        // Get looks in cache first, but GetAll queries the database.
        UnitOfWork.SaveChanges(); 

        // Arrange post act
        var gottenEntity = Repository.Get(entity.Id);
        var newLength = Repository.GetAll().Count();
        var expectedNewLength = length + 1;

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(entity.Id, Is.Not.EqualTo(Guid.Empty), "addedEntity.Id is not equal to Guid.Empty"); // The Add method assigned a value to TEntity.Id
            Assert.That(gottenEntity, Is.EqualTo(entity), "Get(entity.Id) is equal to addedEntity"); // When retrieving entity by Id, the same entity was returned from Add
            Assert.That(newLength, Is.EqualTo(expectedNewLength), "New count is equal to ++length"); // 1 was added to the amount of items in the collection
        });
    }

    /// <summary>
    /// Testing <see cref="BaseRepository{TEntity, TId}.Get(TId?)"/>
    /// </summary>
    [Test]
    public void Get()
    {
        // Arrange
        var entity = new TEntity();
        var randomGuid = Guid.NewGuid();

        Repository.Add(entity);

        // Act
        var gottenEntity = Repository.Get(entity.Id);

        // Assert
        Assert.That(gottenEntity, Is.Not.EqualTo(null), "Get(entity.Id) is not equal to null"); // The added entity can be retrieved by Get
        Assert.Throws<EntityNotFoundException<TEntity, Guid>>(() =>
        {
            Repository.Get(randomGuid);
        }, "Get(NewGuid) throws EntityNotFoundException");
    }

    /// <summary>
    /// Testing <see cref="BaseRepository{TEntity, TId}.Update(TEntity)"/>
    /// </summary>
    [Test]
    public void Update()
    {
        // Arrange
        var entity = new TEntity();
        var originalJson = JsonSerializer.Serialize(entity);

        Repository.Add(entity);

        // Act
        Update(entity);
        Repository.Update(entity);

        // Arrange post act
        string updatedJson = JsonSerializer.Serialize(entity);
        TEntity gottenEntity = Repository.Get(entity.Id);
            
        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(updatedJson, Is.Not.EqualTo(originalJson), "JSON string is different");
            Assert.That(entity, Is.SameAs(gottenEntity), "Received entity is sames as updated");
            Assert.Throws<EntityNotFoundException<TEntity, Guid>>(() =>
            {
                Repository.Update(new TEntity()
                {
                    Id = Guid.NewGuid()
                });
            }, "Throws EntityNotFoundException when updating TEntity not in db");
        });
    }

    /// <summary>
    /// Updates provided <paramref name="entity"/> and return updated entity.
    /// 
    /// As <see cref="TEntity"/> only conists of a Guid Id, this method is used to update the entity on another property, as Ids cannot be changed.
    /// </summary>
    /// <param name="entity">The entity to update</param>
    /// <returns>Updated entity</returns>
    protected abstract TEntity Update(TEntity entity);

    /// <summary>
    /// Tests <see cref="BaseRepository{TEntity, TId}.Delete(TEntity)"/>
    /// </summary>
    [Test]
    public void Delete()
    {
        // Arrange
        var entity = new TEntity();
        Repository.Add(entity);

        // Update database, so the new data can be retrieved by GetAll()
        UnitOfWork.SaveChanges();

        int lengthWithEntity = Repository.GetAll().Count();
        bool addedEntityExists = Repository.Exists(entity.Id);

        // Act
        Repository.Delete(entity);

        // Update database, so GetAll() returns correct amount of entries
        UnitOfWork.SaveChanges();

        // Arrange post act
        int lengthAfterDelete = Repository.GetAll().Count();

        // Assert
        Assert.That(lengthAfterDelete, Is.Not.EqualTo(lengthWithEntity), "Length with entity is not length after delete");
        Assert.Throws<EntityNotFoundException<TEntity, Guid>>(() =>
        {
            Repository.Get(entity.Id);
        });
    }
}