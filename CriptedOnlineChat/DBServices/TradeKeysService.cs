using CriptedOnlineChat.DB;
using CriptedOnlineChat.DB.DBModels;

namespace CriptedOnlineChat.DBServices
{
    public class TradeKeysService : ITradeKeysService
    {
        private ApplicationDbContext applicationDbContext;

        public TradeKeysService(ApplicationDbContext applicationDbContext)
        {
            this.applicationDbContext = applicationDbContext;
        }

        public async Task AddNewRSAKey(TradeKeys newRsaKey)
        {
            await applicationDbContext.TradeKeys.AddAsync(newRsaKey);
            await applicationDbContext.SaveChangesAsync();
            return;

        }

        public async Task<List<TradeKeys>> GetRSAKeysByRecipientId(string recppientId)
        {
            List<TradeKeys> result = applicationDbContext.TradeKeys.Where(x => x.RecipientUserId == recppientId).ToList();
            applicationDbContext.TradeKeys.RemoveRange(result);
            await applicationDbContext.SaveChangesAsync();
            return result;
        }
    }
}