using Business.Services;
using DataAccess;
using Common.DTOs;

using DanhoLibrary.NLayer;

using Microsoft.EntityFrameworkCore; // Microsoft.EntityFrameworkCore.InMemory

using System.Text.Json;
#nullable disable

namespace DataAccessTests
{
    public abstract class ABaseRepositoryTest<TEntity, TDTO, TRepository>
        where TEntity : BaseEntity<Guid>, new()
        where TDTO : ABaseDTO
        where TRepository : BaseRepository<TEntity, Guid>
    {
        protected UnitOfWork UnitOfWork { get; set; }
        protected abstract TRepository Repository { get; }

        [SetUp]
        public void Setup()
        {
            var context = new CitizenTaxiDbContext(
                    new DbContextOptionsBuilder<CitizenTaxiDbContext>()
                    .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
            UnitOfWork = new UnitOfWork(context);
        }

        [TearDown]
        public void TearDown()
        {
            // UnitOfWork.Dispose();
        }

        #region DanhoLibrary.NLayer.BaseRepository

        [Test]
        public void Exists_UsingId_ReturnsCorrespondingBool()
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

        [Test]
        public void Add_Entity_AddsEntity()
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

        [Test]
        public void GetEntity_ById_ReturnsEntity()
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

        [Test]
        public void UpdateEntity_GetsUpdated()
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

        protected abstract TEntity Update(TEntity entity);
        #endregion

        [Test]
        public void DeleteEntity_DeletesEntity()
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
}