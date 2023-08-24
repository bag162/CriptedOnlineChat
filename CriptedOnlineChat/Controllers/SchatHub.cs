using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace CriptedOnlineChat.Controllers
{
    [Route("schatHub")]
    [Authorize]
    public class SchatHub : Hub
    {
        public async Task SendMessage(string message, string recipientLogin)
        {
            await Clients.All.SendAsync("Test", (message + " " + recipientLogin));
        }
    }
}