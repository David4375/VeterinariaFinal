using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface ICita
    {
        // Los que ya tenías
        Task<List<Cita>> ListarTodas();
        Task Crear(Cita cita);
        Task Eliminar(Guid id);

        // --- LOS NUEVOS QUE PIDEN TUS ERRORES ---
        Task<Cita?> ObtenerPorId(Guid id);
        Task Actualizar(Cita cita);
        Task<bool> ExisteCitaEnHorario(DateTime fechaHora);
    }
}