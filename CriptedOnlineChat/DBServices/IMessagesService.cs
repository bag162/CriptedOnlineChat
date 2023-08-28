using CriptedOnlineChat.DB.DBModels;

namespace CriptedOnlineChat.DBServices
{
    public interface IMessagesService
    {
        public Task AddNewMessage(Message message);
        public Task<List<Message>> GetAllMessageByRecipientId(string recipientId);
    }
}
