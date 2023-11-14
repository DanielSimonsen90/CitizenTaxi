using TestConstantsLib;
using API.Controllers;
using Business.Models.Payloads;
using DataAccess.Repositories;
using Common.DTOs;
using Common.Entities;
using Business.Services;
using Common.Entities.User;
using DanhoLibrary.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace ApiTests;

internal class BookingsControllerTest : ABaseControllerTest<
    Booking,
    BookingDTO,
    BookingModifyPayload,
    BookingRepository>
{
    protected override BaseController CreateController(UnitOfWork uow) => new BookingsController(uow);
    protected override BookingRepository Repository => UnitOfWorkMock.Object.Bookings;

    [Test] public override async Task CreateEntity() => await CreateEntity(TestConstants.TEST_BOOKING_PAYLOAD);
    [Test] public override async Task GetEntities()
    {
        // Arrange
        Booking a = TestConstants.TEST_BOOKING;
        Booking b = TestConstants.TEST_BOOKING.CloneEntity(Guid.NewGuid());
        Citizen citizen = TestConstants.TEST_CITIZEN.CloneEntity();

        citizen.Bookings.Add(a);
        Repository.AddRange(a, b);
        UnitOfWorkMock.Object.Citizens.Add(citizen);
        Guid citizenId = citizen.Id;
        await SaveChangesAsync();

        // Act
        IActionResult expectAllBookings = await ((BookingsController)controller).GetBookings(null);
        IActionResult expectCitizenBookings = await ((BookingsController)controller).GetBookings(citizenId);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(expectAllBookings, Is.InstanceOf<OkObjectResult>());
            Assert.That(expectCitizenBookings, Is.InstanceOf<OkObjectResult>());
            Assert.That(GetValueFromResult<List<BookingDTO>>(expectAllBookings), Has.Count.EqualTo(2));
            Assert.That(GetValueFromResult<List<BookingDTO>>(expectCitizenBookings), Has.Count.EqualTo(1));
        });
    }
    [Test] public override async Task GetEntity() => await GetEntity(TestConstants.TEST_BOOKING, Booking.RELATIONS);
    [Test]
    public override async Task UpdateEntity()
    {
        UnitOfWorkMock.Object.Citizens.Add(TestConstants.TEST_CITIZEN);
        await UpdateEntity(TestConstants.TEST_BOOKING, TestConstants.TEST_BOOKING_PAYLOAD);
    }
    [Test] public override Task DeleteEntity() => DeleteEntity(TestConstants.TEST_BOOKING);
}
