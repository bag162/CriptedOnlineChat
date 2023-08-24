using CriptedOnlineChat.DB;
using CriptedOnlineChat.DB.DBModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CriptedOnlineChat.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private UserManager<AppUser> userManager { get; set; }
        private SignInManager<AppUser> signInManager { get; set; }
        public UserController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<string> RegisterNewUser(string login, string password)
        {
            var user = new AppUser() { UserName = login };
            var result = await userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                await signInManager.SignInAsync(user, isPersistent: false);
            }
            else
            {
                return await Task.FromResult(result.Errors.ToString());
            }

            return await Task.FromResult("success");
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<string> LoginUser(string login, string password)
        {
            var result = await signInManager.PasswordSignInAsync(login, password, false, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                return await Task.FromResult("true");
            }
            return await Task.FromResult("false");
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<bool> IsAuthenticated()
        {
            return await Task.FromResult(User.Identity.IsAuthenticated);
        }
    }
}
