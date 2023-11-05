using System.ComponentModel.DataAnnotations.Schema;

namespace CriptedOnlineChat.DB.DBModels
{
    public class TradeKeys
    {
        public string id { get; set; }
        public string SenderUserId { get; set; }
        public string RecipientUserId { get; set; }
        public string nDataJson { get; set; }
        public long nt { get; set; }
        public long ns { get; set; }
        public string eDataJson { get; set; }
        public long et { get; set; }
        public long es { get; set; }

        public AppUser Sender { get; set; }
        public AppUser Recipient { get; set; }
    }
}