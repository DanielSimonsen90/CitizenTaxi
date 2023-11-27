using Azure.Core;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Business.Middlewares;
using Business.Services;
using DataAccess;
using Microsoft.EntityFrameworkCore;

const string KEY_VAULT_NAME = "KEY-VAULT-URI"; // This is retrieved from Azure ENV variables
const string CONNECTION_STRING = "CONNECTION-STRING"; // This is retrieved from Azure KeyVault

string keyVaultUri = Environment.GetEnvironmentVariable(KEY_VAULT_NAME) 
    ?? throw new InvalidOperationException("Key Vault URI not found");
var client = new SecretClient(new Uri(keyVaultUri), new DefaultAzureCredential());

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
    //string connectionString = Environment.GetEnvironmentVariable("DefaultConnection")
    //    ?? builder.Configuration.GetConnectionString("DefaultConnection")!;
    // Get connectionString from Azure Key Vault
    string connectionString = client.GetSecretAsync(CONNECTION_STRING).Result.Value.Value;
    options.UseSqlServer(connectionString);
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

app.Run();
