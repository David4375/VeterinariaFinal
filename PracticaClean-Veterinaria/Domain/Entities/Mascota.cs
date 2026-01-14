using System;
using System.Text.Json.Serialization; 

namespace Domain.Entities
{
    public class Mascota
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Especie { get; set; } = string.Empty;
        public string Raza { get; set; } = string.Empty;
        public int Edad { get; set; }
        public string Descripcion { get; set; } = string.Empty;

        public Guid ClienteId { get; set; }
        
        // BORRA EL [JsonIgnore] DE AQUÍ ABAJO:
        public Cliente? Dueño { get; set; } 
    }
}