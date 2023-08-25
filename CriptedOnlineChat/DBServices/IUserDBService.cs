using CriptedOnlineChat.DB.DBModels;

namespace CriptedOnlineChat.DBServices
{
    public interface IUserDBService
    {
        public Task<AppUser[]> FindUsersByLogin(string login);
    }
}
