using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Aplication.UseCases
{
    public class GestionarMascotas // <--- AQUI ESTABA EL ERROR (Antes decía Macota)
    {
        private readonly IMascota _mascotaRepo;

        public GestionarMascotas(IMascota mascotaRepo)
        {
            _mascotaRepo = mascotaRepo;
        }

        public async Task<List<Mascota>> ListarTodas()
        {
            return await _mascotaRepo.ListarTodos(); // Asegúrate que tu Repo tenga este método
        }

        public async Task Guardar(Mascota mascota)
        {
            if (string.IsNullOrEmpty(mascota.Nombre))
                throw new Exception("El nombre es obligatorio.");

            if (mascota.ClienteId == Guid.Empty)
                throw new Exception("La mascota debe tener un dueño asignado.");

            if (mascota.Id == Guid.Empty)
            {
                mascota.Id = Guid.NewGuid();
                await _mascotaRepo.Crear(mascota);
            }
            else
            {
                await _mascotaRepo.Actualizar(mascota);
            }
        }

        public async Task Eliminar(Guid id)
        {
            await _mascotaRepo.Eliminar(id);
        }
    }
}