using Domain.Entities;
using Domain.Interfaces;

namespace Aplication.UseCases
{
    public class RegistrarMascota
    {
        private readonly IMascota _mascotaRepo;
        public RegistrarMascota(IMascota mascotaRepo) => _mascotaRepo = mascotaRepo;

        public async Task EjecutarAsync(Mascota mascota)
        {
            if (string.IsNullOrEmpty(mascota.Nombre)) throw new Exception("El nombre es obligatorio");
            await _mascotaRepo.Crear(mascota);
        }
    }
}