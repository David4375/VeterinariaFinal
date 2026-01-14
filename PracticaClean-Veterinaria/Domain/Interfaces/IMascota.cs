using Domain.Entities;
using System;
using System.Collections.Generic; // Importante para List<>
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IMascota
    {
        Task<List<Mascota>> ListarTodos(); // <--- ESTO FALTABA
        Task Crear(Mascota mascota);
        Task Actualizar(Mascota mascota);
        Task Eliminar(Guid id);
    }
}