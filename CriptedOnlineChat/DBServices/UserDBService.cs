using CriptedOnlineChat.DB;
using CriptedOnlineChat.DB.DBModels;

namespace CriptedOnlineChat.DBServices
{
    public class UserDBService : IUserDBService
    {
        private ApplicationDbContext applicationDbContext;

        public UserDBService(ApplicationDbContext applicationDbContext)
        {
            this.applicationDbContext = applicationDbContext;
        }

        public async Task<AppUser[]> FindUsersByLogin(string login)
        {
            var result = applicationDbContext.Users.AsQueryable().Where(x => x.UserName.StartsWith(login)).ToArray();
            return await Task.FromResult(result);
        }
    }
}
