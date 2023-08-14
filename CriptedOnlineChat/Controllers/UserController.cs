using CriptedOnlineChat.DB;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CriptedOnlineChat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private ApplicationContext applicationContext { get; set; }

        public UserController(ApplicationContext applicationContext)
        {
            this.applicationContext = new ApplicationContext();
        }


        [HttpGet]
        public string CheckEmploymentLogin(string login)
        {
            bool employment = applicationContext.Users.Any(x => x.Login == login);
            return JsonConvert.SerializeObject(employment);
        }

        // GET: api/<UserController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<UserController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
