namespace CriptedOnlineChat.Controllers.DTO
{
    public class RSAKeyDTO
    {
        public string SenderLogin { get; set; }
        public string SenderUserId { get; set; }
        public string RecipientUserId { get; set; }
        public long nt { get; set; }
        public long ns { get; set; }
        public long et { get; set; }
        public long es { get; set; }
        public string nDataJson { get; set; }
        public string eDataJson { get; set; }
    }

    public class SendMessageDTO
    {
        public string Data { get; set; }
        public string SenderId { get; set; }
        public string RecipientId { get; set; }
    }
}