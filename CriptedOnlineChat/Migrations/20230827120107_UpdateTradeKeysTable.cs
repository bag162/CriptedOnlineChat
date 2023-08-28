using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CriptedOnlineChat.Migrations
{
    public partial class UpdateTradeKeysTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "SenderUserId",
                table: "TradeKeys",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "RecipientUserId",
                table: "TradeKeys",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_TradeKeys_RecipientUserId",
                table: "TradeKeys",
                column: "RecipientUserId");

            migrationBuilder.CreateIndex(
                name: "IX_TradeKeys_SenderUserId",
                table: "TradeKeys",
                column: "SenderUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TradeKeys_AspNetUsers_RecipientUserId",
                table: "TradeKeys",
                column: "RecipientUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_TradeKeys_AspNetUsers_SenderUserId",
                table: "TradeKeys",
                column: "SenderUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TradeKeys_AspNetUsers_RecipientUserId",
                table: "TradeKeys");

            migrationBuilder.DropForeignKey(
                name: "FK_TradeKeys_AspNetUsers_SenderUserId",
                table: "TradeKeys");

            migrationBuilder.DropIndex(
                name: "IX_TradeKeys_RecipientUserId",
                table: "TradeKeys");

            migrationBuilder.DropIndex(
                name: "IX_TradeKeys_SenderUserId",
                table: "TradeKeys");

            migrationBuilder.AlterColumn<string>(
                name: "SenderUserId",
                table: "TradeKeys",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "RecipientUserId",
                table: "TradeKeys",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
