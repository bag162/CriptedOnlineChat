using AutoMapper;
using CriptedOnlineChat.Controllers.DTO;
using CriptedOnlineChat.DB.DBModels;
using CriptedOnlineChat.DBServices;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Identity;


namespace CriptedOnlineChat.Controllers
{
    [EnableCors("CorsPolicy")]
    [Route("schatHub")]
    public class SchatHub : Hub
    {
        private ILogger<SchatHub> _logger;
        private IMapper mapper;
        private ITradeKeysService tradeKeyService;
        private IUserService userDBService;
        private IMessagesService messagesService;

        public SchatHub(ITradeKeysService tradeKeyService, IMapper mapper, ILogger<SchatHub> _logger, IUserService userDBService, IMessagesService messagesService)
        {
            this.tradeKeyService = tradeKeyService;
            this.mapper = mapper;
            this._logger = _logger;
            this.userDBService = userDBService;
            this.messagesService = messagesService;
        }


        public async Task SendRSAKeysAsync(RSAKeyDTO rsaKey)
        {
            TradeKeys insertedKey = mapper.Map<TradeKeys>(rsaKey);
            insertedKey.id = Guid.NewGuid().ToString();
            await tradeKeyService.AddNewRSAKey(insertedKey);
            PingUserAsync(userDBService.FindUserById(rsaKey.RecipientUserId).Result.UserName);
            return;
        }

        public async Task SendMessageAsync(SendMessageDTO message)
        {
            Message addedMessage = mapper.Map<Message>(message);
            await messagesService.AddNewMessage(addedMessage);
            PingUserAsync(userDBService.FindUserById(message.RecipientId).Result.UserName);
            return;

        }

        public async Task UpdateDataAsync()
        {
            OnConnectedAsync();
        }

        public async override Task<Task> OnConnectedAsync()
        {
            string userId = userDBService.FindUsersByLogin(Context.User.Identity.Name).Result.Select(x => x.Id).FirstOrDefault();
            _logger.LogInformation("WebSocket Connected: " + userId);
            SendUserNewRSAKeysAsync(userId);
            SendUserNewMessagesAsync(userId);
            return base.OnConnectedAsync();
        }

        private async Task SendUserNewRSAKeysAsync(string userId)
        {
            List<TradeKeys> newKeys = await tradeKeyService.GetRSAKeysByRecipientId(userId);
            if (newKeys.Count == 0)
            {
                return;
            }
            List<RSAKeyDTO> sendedRsaKeys = new();
            foreach (TradeKeys element in newKeys)
            {
                RSAKeyDTO rSAKeyDTO = mapper.Map<RSAKeyDTO>(element);
                rSAKeyDTO.SenderLogin = userDBService.FindUserById(rSAKeyDTO.SenderUserId).Result.UserName;
                sendedRsaKeys.Add(rSAKeyDTO);
            }
            
            await Clients.User(Context.UserIdentifier).SendAsync("AddNewRSAKeys", sendedRsaKeys.ToArray());
            return;
        }

        private async Task SendUserNewMessagesAsync(string userId)
        {
            List<Message> newMessages = await messagesService.GetAllMessageByRecipientId(userId);
            if(newMessages.Count() == 0)
            {
                return;
            }
            List<SendMessageDTO> sendedMessages = new();
            foreach (Message message in newMessages)
            {
                sendedMessages.Add(mapper.Map<SendMessageDTO>(message));
            }

            await Clients.User(Context.UserIdentifier).SendAsync("AddNewMessages", sendedMessages);
        }

        private async Task PingUserAsync(string userLogin)
        {
            _logger.LogInformation("Ping User: " + userLogin);
            await Clients.User(userLogin).SendAsync("UpdateData");
        }

        
    }
}