using System;

namespace Domain.Entities
{
    public class Medicamento
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Laboratorio { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public int Stock { get; set; }
        public DateTime FechaVencimiento { get; set; }
        
        // NUEVO CAMPO: Aquí guardaremos si es "Vacuna", "Alimento", etc.
        public string Tipo { get; set; } = "Medicamentos"; 
    }
}