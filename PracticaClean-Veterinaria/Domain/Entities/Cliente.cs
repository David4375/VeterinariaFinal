using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public class Cliente
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Ubicacion { get; set; } = string.Empty; // Ciudad/Dirección
        public string Correo { get; set; } = string.Empty; // Dato extra útil

        // Relación: Un cliente tiene muchas mascotas
        public List<Mascota> Mascotas { get; set; } = new List<Mascota>();
    }
}