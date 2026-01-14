namespace Aplication.DTOs
{
    public class MascotaDTO
    {
        public string Nombre { get; set; } = string.Empty;
        public string Especie { get; set; } = string.Empty;
        public string Raza { get; set; } = string.Empty;
        public int Edad { get; set; }
        public string NombreDueño { get; set; } = string.Empty;
    }
}