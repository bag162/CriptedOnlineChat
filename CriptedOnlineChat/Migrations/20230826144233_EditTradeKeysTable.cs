using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CriptedOnlineChat.Migrations
{
    public partial class EditTradeKeysTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "eDataJson",
                table: "TradeKeys",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<long>(
                name: "es",
                table: "TradeKeys",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "et",
                table: "TradeKeys",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "nDataJson",
                table: "TradeKeys",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<long>(
                name: "ns",
                table: "TradeKeys",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "nt",
                table: "TradeKeys",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "eDataJson",
                table: "TradeKeys");

            migrationBuilder.DropColumn(
                name: "es",
                table: "TradeKeys");

            migrationBuilder.DropColumn(
                name: "et",
                table: "TradeKeys");

            migrationBuilder.DropColumn(
                name: "nDataJson",
                table: "TradeKeys");

            migrationBuilder.DropColumn(
                name: "ns",
                table: "TradeKeys");

            migrationBuilder.DropColumn(
                name: "nt",
                table: "TradeKeys");
        }
    }
}
