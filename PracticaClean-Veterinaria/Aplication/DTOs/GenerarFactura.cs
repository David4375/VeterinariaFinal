using System;

namespace Aplication.DTOs
{
    public class GenerarFacturaDTO
    {
        public Guid VentaId { get; set; }
        public string ClienteNombre { get; set; } = "S/N";
        public string ClienteNit { get; set; } = "0";
    }
}