using System;

namespace Domain.Entities
{
    public class Cita
    {
        public Guid Id { get; set; }
        public Guid MascotaId { get; set; }
        public DateTime FechaHora { get; set; }
        public string Motivo { get; set; } = string.Empty;
        public string Estado { get; set; } = "Programada";
    }
}