using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infraestructure.Migrations
{
    /// <inheritdoc />
    public partial class AjusteFinalMedicamento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Categoria",
                table: "Medicamentos");

            migrationBuilder.DropColumn(
                name: "StockMinimo",
                table: "Medicamentos");

            migrationBuilder.RenameColumn(
                name: "Tipo",
                table: "Medicamentos",
                newName: "Laboratorio");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Laboratorio",
                table: "Medicamentos",
                newName: "Tipo");

            migrationBuilder.AddColumn<string>(
                name: "Categoria",
                table: "Medicamentos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "StockMinimo",
                table: "Medicamentos",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
