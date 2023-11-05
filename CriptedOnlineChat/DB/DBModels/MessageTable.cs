using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace CriptedOnlineChat.DB.DBModels
{
    public class Message
    {
        public int Id { get; set; }
        public string Data { get; set; }
        public string SenderId { get; set; }
        public string RecipientId { get; set; }
    }
}