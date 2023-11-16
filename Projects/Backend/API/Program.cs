using Business.Hubs;
using Business.Middlewares;
using Business.Services;
using DataAccess;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add business services
builder.Services.AddSingleton<CacheService>();
builder.Services.AddSingleton<AuthService>();

builder.Services.AddDbContext<CitizenTaxiDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddScoped<UnitOfWork>();
builder.Services.AddScoped<LoginService>();
builder.Services.AddSignalR();

// Force lowercase endpoints
builder.Services.AddRouting(options => options.LowercaseUrls = true);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(builder => builder
    .AllowAnyHeader()
    .AllowAnyMethod()
    .SetIsOriginAllowed(_ => true)
    .AllowCredentials());

app.UseHttpsRedirection();
app.UseAuthorization();

app.UseMiddleware<AuthMiddleware>();

app.MapControllers();
app.MapHub<NotificationHub>($"api/{NotificationHub.ENDPOINT}");

app.Run();
