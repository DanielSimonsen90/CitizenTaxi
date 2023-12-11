using Business.Middlewares;
using Business.Services;
using DataAccess;
using Microsoft.EntityFrameworkCore;

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
    try
    {
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("ConnectionStrings.json")
            .Build();

        options.UseSqlServer(configuration.GetSection(
            //"DefaultConnection"
            "ReleaseConnection"
        ).Value);
    }
    catch
    {
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    }
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

app.UseHttpsRedirection();
app.UseAuthorization();

app.UseMiddleware<AuthMiddleware>();

app.MapControllers();

app.Run();
