using CriptedOnlineChat.Controllers;
using CriptedOnlineChat.DB;
using CriptedOnlineChat.DB.DBModels;
using CriptedOnlineChat.DBServices;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

/*IDENTITY*/


// Identity service
builder.Services.AddDefaultIdentity<AppUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>();

// configure identity password requres
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;
});


/*DATABASE*/


// DB context
var connectionString = builder.Configuration.GetConnectionString("DefaultConString");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// DB Services
builder.Services.AddScoped<IUserDBService, UserDBService>();


/*OTHER*/

builder.Services.AddSignalR();

// Configure cookie
builder.Services.ConfigureApplicationCookie(options =>
{
    // Cookie settings
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromDays(7);

    options.LoginPath = "/login";
    options.AccessDeniedPath = "/AccessDenied";
    options.SlidingExpiration = true;
});

// Add WebSocket dep
builder.Services.AddSingleton<SchatHub>();

// Configure CORS Policy
builder.Services.AddCors(o => o.AddPolicy("CorsPolicy", builder =>
{
    builder
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        .WithOrigins("http://localhost:44457", "http://localhost:5172", "http://localhost:38179");
}));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
}

app.UseWebSockets(new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromSeconds(120),
});


app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("CorsPolicy");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action}");
app.MapControllerRoute(
    name: "api",
    pattern: "api/{controller}/{action}");
app.UseRouting();



app.MapHub<SchatHub>("/schatHub");

app.UseAuthorization();
app.UseAuthentication();

app.MapFallbackToFile("index.html"); ;

app.Run();
