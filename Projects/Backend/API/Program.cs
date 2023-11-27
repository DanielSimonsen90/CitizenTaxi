using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Business.Middlewares;
using Business.Services;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

const string CONNECTION_STRING = "CONNECTION-STRING"; // This is retrieved from Azure KeyVault

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add business services
builder.Services.AddSingleton<CacheService>();
builder.Services.AddSingleton<AuthService>();

builder.Services.AddDbContext<CitizenTaxiDbContext>(options =>
{
    IConfigurationRoot configuration = new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("ConnectionStrings.json")
        .Build();

    options.UseSqlServer(configuration.GetSection(
        //"DefaultConnection"
        "ReleaseConnection"
    ).Value);
});

builder.Services.AddScoped<UnitOfWork>();
builder.Services.AddScoped<LoginService>();
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder => builder
        .AllowAnyHeader()
        .AllowAnyMethod()
        .SetIsOriginAllowed(origin => true)
        .AllowCredentials());
});

// Force lowercase endpoints
builder.Services.AddRouting(options => options.LowercaseUrls = true);

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
//app.UseCors(builder => builder
//    .AllowAnyHeader() // HTTP Headers
//    .AllowAnyMethod() // HTTP Methods
//    .SetIsOriginAllowed(origin => new string[]
//    {
//        "http://localhost:3000",
//        "https://citizentaxi.netlify.app/"
//    }.Contains(origin)) // Allow any origin
//    .AllowCredentials());

app.UseHttpsRedirection();
app.UseAuthorization();

app.UseMiddleware<AuthMiddleware>();

app.MapControllers();

app.Run();
