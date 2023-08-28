using CriptedOnlineChat.DB;
using CriptedOnlineChat.DB.DBModels;

namespace CriptedOnlineChat.DBServices
{
    public class UserService : IUserService
    {
        private ApplicationDbContext applicationDbContext;

        public UserService(ApplicationDbContext applicationDbContext)
        {
            this.applicationDbContext = applicationDbContext;
        }

        public async Task<AppUser> FindUserById(string id)
        {
            return await Task.FromResult(applicationDbContext.Users.AsQueryable().Where(x => x.Id == id).FirstOrDefault());
        }

        public async Task<AppUser[]> FindUsersByLogin(string login)
        {
            var result = applicationDbContext.Users.AsQueryable().Where(x => x.UserName.StartsWith(login)).ToArray();
            return await Task.FromResult(result);
        }
    }
}
