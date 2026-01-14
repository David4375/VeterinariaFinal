using System;

namespace Aplication.DTOs
{
    public class MedicamentoDTOs
    {
        public Guid? Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Laboratorio { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public int Stock { get; set; }
        public DateTime FechaVencimiento { get; set; }
        
        // NUEVO CAMPO
        public string Tipo { get; set; } = string.Empty;
    }
}