using CriptedOnlineChat.Controllers.DTO;
using CriptedOnlineChat.DB.DBModels;
using CriptedOnlineChat.DBServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CriptedOnlineChat.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private UserManager<AppUser> userManager { get; set; }
        private SignInManager<AppUser> signInManager { get; set; }
        private IUserDBService userDbService;
        public UserController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IUserDBService userDBService)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.userDbService = userDBService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<string> Registration([FromBody]UserRegisterDTO registerUser)
        {
            var user = new AppUser() { UserName = registerUser.login, EmailConfirmed = true };
            var result = await userManager.CreateAsync(user, registerUser.password);
            if (result.Succeeded)
            {
                await signInManager.SignInAsync(user, isPersistent: registerUser.isPersistent);
            }
            else
            {
                return await Task.FromResult(result.Errors.FirstOrDefault().Description);
            }

            return await Task.FromResult("true");
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<string> Login([FromBody] UserLoginDTO loginnedUser)
        {
            var result = await signInManager.PasswordSignInAsync(loginnedUser.login, loginnedUser.password, loginnedUser.isPersistent, lockoutOnFailure: false);
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

        [HttpPost]
        public async Task<string[]> FindUser([FromBody] FindUserDTO findedUser)
        {
            string[] users = userDbService.FindUsersByLogin(findedUser.login).Result.Select(x => x.UserName).ToArray();
            return await Task.FromResult(users);
        }
    }
}