using Domain.Interfaces;
using Domain.Entities;

namespace Aplication.UseCases
{
    public class GestionarCitas
    {
        private readonly ICita _repo;
        public GestionarCitas(ICita repo) => _repo = repo;

        public async Task<IEnumerable<Cita>> Listar() => await _repo.ListarTodas();

        public async Task CancelarCita(Guid id)
        {
            var cita = await _repo.ObtenerPorId(id);
            if (cita == null) throw new Exception("Cita no encontrada");

            cita.Estado = "Cancelada";
            await _repo.Actualizar(cita);
        }

        public async Task CompletarCita(Guid id)
        {
            var cita = await _repo.ObtenerPorId(id);
            if (cita != null)
            {
                cita.Estado = "Realizada";
                await _repo.Actualizar(cita);
            }
        }
    }
}