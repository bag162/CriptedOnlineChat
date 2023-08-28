namespace CriptedOnlineChat.Controllers.DTO
{
    public class UserLoginDTO
    {
        public string login { get; set; }
        public string password { get; set; }
        public bool isPersistent { get; set; }
    }

    public class UserRegisterDTO
    {
        public string login { get; set; }
        public string password { get; set; }
        public bool isPersistent { get; set; }
    }

    public class FindUserDTO
    {
        public string login { get; set; }
        public string? id { get; set; }
    }

    public class FinishRegisterUserDTO
    {
        public bool isSuccess { get; set; }
        public string descriptionError { get; set; }
        public string id { get; set; }
        public string login { get; set; }
    }
}
