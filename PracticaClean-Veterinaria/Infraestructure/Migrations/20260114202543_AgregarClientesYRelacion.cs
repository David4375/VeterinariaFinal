using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infraestructure.Migrations
{
    /// <inheritdoc />
    public partial class AgregarClientesYRelacion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NombreDueño",
                table: "Mascotas",
                newName: "Descripcion");

            migrationBuilder.AddColumn<Guid>(
                name: "ClienteId",
                table: "Mascotas",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Clientes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Apellido = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telefono = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ubicacion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Correo = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clientes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Mascotas_ClienteId",
                table: "Mascotas",
                column: "ClienteId");

            migrationBuilder.AddForeignKey(
                name: "FK_Mascotas_Clientes_ClienteId",
                table: "Mascotas",
                column: "ClienteId",
                principalTable: "Clientes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Mascotas_Clientes_ClienteId",
                table: "Mascotas");

            migrationBuilder.DropTable(
                name: "Clientes");

            migrationBuilder.DropIndex(
                name: "IX_Mascotas_ClienteId",
                table: "Mascotas");

            migrationBuilder.DropColumn(
                name: "ClienteId",
                table: "Mascotas");

            migrationBuilder.RenameColumn(
                name: "Descripcion",
                table: "Mascotas",
                newName: "NombreDueño");
        }
    }
}
