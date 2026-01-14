using System;

namespace Aplication.DTOs
{
    public class ClienteDTO
    {
        public Guid Id { get; set; }
        public string NombreCompleto { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Ubicacion { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;
        public int CantidadMascotas { get; set; }
    }

    public class CrearClienteConMascotaDTO
    {
        // Datos Cliente
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Ubicacion { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;

        // Datos Mascota Inicial
        public string NombreMascota { get; set; } = string.Empty;
        public string Especie { get; set; } = string.Empty;
        public string Raza { get; set; } = string.Empty;
        public int Edad { get; set; }
        public string Descripcion { get; set; } = string.Empty;
    }
}