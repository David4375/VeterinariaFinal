using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IMedicamento
    {
        Task Crear(Medicamento medicamento);
        Task<Medicamento?> ObtenerId(Guid id);
        Task Actualizar(Medicamento medicamento);

        // --- NUEVOS ---
        Task<IEnumerable<Medicamento>> ListarTodos();
        Task Eliminar(Guid id);
    }
}