using CriptedOnlineChat.DB.DBModels;

namespace CriptedOnlineChat.DBServices
{
    public interface ITradeKeysService
    {
        public Task AddNewRSAKey(TradeKeys newRsaKey);
        public Task<List<TradeKeys>> GetRSAKeysByRecipientId(string recppientId);
    }
}