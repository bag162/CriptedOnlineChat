using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace CriptedOnlineChat.DB.DBModels
{
    public class Message
    {
        public int Id { get; set; }
        public string Data { get; set; }
        public DateTime DateTime { get; set; }
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public AppUser User { get; set; }
    }
}