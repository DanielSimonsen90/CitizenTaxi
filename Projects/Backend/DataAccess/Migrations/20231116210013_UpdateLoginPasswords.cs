using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLoginPasswords : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Logins",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Salt = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Logins", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Admins",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    LoginId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Admins", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Admins_Logins_LoginId",
                        column: x => x.LoginId,
                        principalTable: "Logins",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Citizens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    LoginId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Citizens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Citizens_Logins_LoginId",
                        column: x => x.LoginId,
                        principalTable: "Logins",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Pickup = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Destination = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Arrival = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CitizenId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bookings_Citizens_CitizenId",
                        column: x => x.CitizenId,
                        principalTable: "Citizens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Notes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CitizenId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Pensioner = table.Column<bool>(type: "bit", nullable: false),
                    Residence = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CarHeight = table.Column<int>(type: "int", nullable: false),
                    HelpingUtil = table.Column<int>(type: "int", nullable: false),
                    Companion = table.Column<int>(type: "int", nullable: false),
                    Follow = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notes_Citizens_CitizenId",
                        column: x => x.CitizenId,
                        principalTable: "Citizens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Admins",
                columns: new[] { "Id", "LoginId", "Name", "Role" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000000001"), null, "Admin", 1 });

            migrationBuilder.InsertData(
                table: "Citizens",
                columns: new[] { "Id", "Email", "LoginId", "Name", "Role" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000000002"), "", null, "Borger", 0 });

            migrationBuilder.InsertData(
                table: "Logins",
                columns: new[] { "Id", "Password", "Salt", "UserId", "Username" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000003"), "VtH/hEKvAnRHm/c0lS0IwkDIgl/IzbaPDep4QZSx6hV2br3jnBVhet9RdyBtAvFBoD5AR38haS2IelS/BIbhUg==", "salt", new Guid("00000000-0000-0000-0000-000000000001"), "admin" },
                    { new Guid("00000000-0000-0000-0000-000000000004"), "ALXb8Wpq657/JDm5lNuxyPXIKCPgET0FZIZfzgNUJbd1LRXJWTLXbIscvif2p4lZXHmIsxe+7QwT9fl6mD6hkw==", "salt", new Guid("00000000-0000-0000-0000-000000000002"), "borger" }
                });

            migrationBuilder.InsertData(
                table: "Bookings",
                columns: new[] { "Id", "Arrival", "CitizenId", "Destination", "Pickup" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000006"), new DateTime(2023, 11, 17, 0, 0, 13, 689, DateTimeKind.Local).AddTicks(6909), new Guid("00000000-0000-0000-0000-000000000002"), "Frederikshavn Sygehus", "Solvej 10, 0000 God by" },
                    { new Guid("00000000-0000-0000-0000-000000000007"), new DateTime(2023, 11, 17, 1, 30, 13, 691, DateTimeKind.Local).AddTicks(4274), new Guid("00000000-0000-0000-0000-000000000002"), "Solvej 10, 0000 God by", "Frederikshavn Sygehus" }
                });

            migrationBuilder.InsertData(
                table: "Notes",
                columns: new[] { "Id", "CarHeight", "CitizenId", "Companion", "Follow", "HelpingUtil", "Pensioner", "Residence" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000000005"), 2, new Guid("00000000-0000-0000-0000-000000000002"), 2, 3, 4, true, "Solvej 10, 0000 God by" });

            migrationBuilder.CreateIndex(
                name: "IX_Admins_LoginId",
                table: "Admins",
                column: "LoginId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_CitizenId",
                table: "Bookings",
                column: "CitizenId");

            migrationBuilder.CreateIndex(
                name: "IX_Citizens_LoginId",
                table: "Citizens",
                column: "LoginId");

            migrationBuilder.CreateIndex(
                name: "IX_Notes_CitizenId",
                table: "Notes",
                column: "CitizenId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Admins");

            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "Notes");

            migrationBuilder.DropTable(
                name: "Citizens");

            migrationBuilder.DropTable(
                name: "Logins");
        }
    }
}
