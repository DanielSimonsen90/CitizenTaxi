using TestConstantsLib;
using API.Controllers;
using Business.Models.Payloads;
using DataAccess.Repositories;
using Common.DTOs;
using Common.Entities;
using Business.Services;

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
    [Test] public override async Task GetEntity() => await GetEntity(TestConstants.TEST_BOOKING, Booking.RELATIONS);
    [Test] public override async Task UpdateEntity()
    {
        UnitOfWorkMock.Object.Citizens.Add(TestConstants.TEST_CITIZEN);
        await UpdateEntity(TestConstants.TEST_BOOKING, TestConstants.TEST_BOOKING_PAYLOAD);
    }
    [Test] public override Task DeleteEntity() => DeleteEntity(TestConstants.TEST_BOOKING);
}
