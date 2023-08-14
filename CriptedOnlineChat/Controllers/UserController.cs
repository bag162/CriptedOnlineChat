using CriptedOnlineChat.DB;
using CriptedOnlineChat.DB.DBModels;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CriptedOnlineChat.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private ApplicationContext applicationContext { get; set; }

        public UserController(ApplicationContext applicationContext)
        {
            this.applicationContext = new ApplicationContext();
        }


        [HttpPost]
        public string RegisterNewUser([FromBody]User newUser)
        {
            if (!applicationContext.Users.Any(x => x.Login == newUser.Login))
            {
                this.applicationContext.Users.Add(new DB.DBModels.User() { Login = newUser.Login });
                this.applicationContext.SaveChanges();
                return JsonConvert.SerializeObject("true");
            }
            else
            {
                return JsonConvert.SerializeObject("Error");
            }
        }
    }
}
