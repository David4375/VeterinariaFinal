using System;

namespace Aplication.DTOs
{
    public class AgendarCitaDTO
    {
        public Guid MascotaId { get; set; }
        public DateTime FechaHora { get; set; }
        public string Motivo { get; set; } = string.Empty;
    }
}