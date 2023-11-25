FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["CriptedOnlineChat.csproj", "CriptedOnlineChat/"]
RUN dotnet restore "CriptedOnlineChat/CriptedOnlineChat.csproj"
COPY . .


WORKDIR "/"
RUN apt update
RUN apt install -y npm
RUN npm install -g @angular/cli
RUN npm install -g @types/angular

WORKDIR "/src/ClientApp"
RUN npm cache clean -f
RUN npm install -g n
RUN n 14.17.3

WORKDIR "/src"
RUN dotnet build "CriptedOnlineChat.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CriptedOnlineChat.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CriptedOnlineChat.dll"]