using CriptedOnlineChat.DB.DBModels;
using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CriptedOnlineChat.DB
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<AppUser>
    {
        public DbSet<AppUser> Users { get; set; }
        public DbSet<Message> Messaages { get; set; }
        public DbSet<TradeKeys> TradeKeys { get; set; }

        public ApplicationDbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options, operationalStoreOptions)
        {
            Database.EnsureCreated();
        }
    }
}
