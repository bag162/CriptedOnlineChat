using CriptedOnlineChat.DB.DBModels;

namespace CriptedOnlineChat.DBServices
{
    public interface IUserService
    {
        public Task<AppUser[]> FindUsersByLogin(string login);
        public Task<AppUser> FindUserById(string id);
    }
}
