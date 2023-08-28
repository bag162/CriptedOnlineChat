using AutoMapper;
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
        private IUserService userDbService;
        private IMapper mapper;
        public UserController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IUserService userDBService, IMapper mapper)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.userDbService = userDBService;
            this.mapper = mapper;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<FinishRegisterUserDTO> Registration([FromBody]UserRegisterDTO registerUser)
        {
            var user = new AppUser() { UserName = registerUser.login, EmailConfirmed = true };
            string userId;
            var result = await userManager.CreateAsync(user, registerUser.password);
            if (result.Succeeded)
            {
                await signInManager.SignInAsync(user, isPersistent: registerUser.isPersistent);
                userId = userDbService.FindUsersByLogin(registerUser.login).Result.FirstOrDefault().Id;
            }
            else
            {
                return await Task.FromResult(new FinishRegisterUserDTO() { isSuccess = false, descriptionError = result.Errors.FirstOrDefault().Description });
            }

            return await Task.FromResult(new FinishRegisterUserDTO() { isSuccess = true, login = registerUser.login, id = userId });
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
        public async Task<FindUserDTO[]> FindUser([FromBody] FindUserDTO findedUser)
        {
            var result = userDbService.FindUsersByLogin(findedUser.login).Result.ToList();
            result.RemoveAll(x => x.UserName == User.Identity.Name);
            var users = mapper.Map<FindUserDTO[]>(result);
            return await Task.FromResult(users.ToArray());
        }
    }
}