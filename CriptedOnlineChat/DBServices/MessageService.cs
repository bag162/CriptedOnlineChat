using CriptedOnlineChat.DB;
using CriptedOnlineChat.DB.DBModels;

namespace CriptedOnlineChat.DBServices
{
    public class MessageService : IMessagesService
    {
        private ApplicationDbContext appContext;
        public MessageService(ApplicationDbContext appContext)
        {
            this.appContext = appContext;
        }

        public async Task AddNewMessage(Message message)
        {
            await appContext.Messaages.AddAsync(message);
            await appContext.SaveChangesAsync();
        }

        public async Task<List<Message>> GetAllMessageByRecipientId(string recipientId)
        {
            var messages = appContext.Messaages.AsQueryable().Where(x => x.RecipientId == recipientId).ToList();
            appContext.Messaages.RemoveRange(messages);
            await appContext.SaveChangesAsync();
            return messages;
        }
    }
}
