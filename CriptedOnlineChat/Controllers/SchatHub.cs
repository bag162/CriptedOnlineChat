using AutoMapper;
using CriptedOnlineChat.Controllers.DTO;
using CriptedOnlineChat.DB.DBModels;
using CriptedOnlineChat.DBServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;


namespace CriptedOnlineChat.Controllers
{
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


        public async Task SendRSAKeys(RSAKeyDTO rsaKey)
        {
            TradeKeys insertedKey = mapper.Map<TradeKeys>(rsaKey);
            insertedKey.id = Guid.NewGuid().ToString();
            await tradeKeyService.AddNewRSAKey(insertedKey);
            return;
        }

        public async Task SendMessage(SendMessageDTO message)
        {
            Message addedMessage = mapper.Map<Message>(message);
            await messagesService.AddNewMessage(addedMessage);
            return;

        }
        public override Task OnConnectedAsync()
        {
            string userId = userDBService.FindUsersByLogin(Context.User.Identity.Name).Result.Select(x => x.Id).FirstOrDefault();
            SendUserNewRSAKeys(userId);
            SendUserNewMessages(userId);

            return base.OnConnectedAsync();
        }

        private async Task SendUserNewRSAKeys(string userId)
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

        private async Task SendUserNewMessages(string userId)
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
    }
}