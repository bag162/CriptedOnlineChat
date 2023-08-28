using AutoMapper;
using CriptedOnlineChat.Controllers.DTO;
using CriptedOnlineChat.DB.DBModels;

namespace CriptedOnlineChat
{
    public class AppMappingProfile : Profile
    {
        public AppMappingProfile()
        {
            CreateMap<AppUser, FindUserDTO>().ForMember(dest => dest.login, opt => opt.MapFrom(src => src.UserName));
            CreateMap<FindUserDTO, AppUser>().ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.login));
            CreateMap<RSAKeyDTO, TradeKeys>().ReverseMap();
            CreateMap<SendMessageDTO, Message>().ReverseMap();
        }
    }
}
