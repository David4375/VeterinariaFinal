using Microsoft.AspNetCore.Mvc;
using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace WebApI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CitaController : ControllerBase
    {
        private readonly ICita _citaRepo;

        public CitaController(ICita citaRepo)
        {
            _citaRepo = citaRepo;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _citaRepo.ListarTodas());
        }

        // ESTE ES EL QUE ARREGLA EL ERROR 405
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Cita cita)
        {
            try
            {
                if (cita.MascotaId == Guid.Empty) 
                    return BadRequest("Error: No se seleccionó una mascota válida.");

                // Asignar ID si es nueva
                if (cita.Id == Guid.Empty)
                {
                    cita.Id = Guid.NewGuid();
                }

                // Asegurar fecha válida
                if (cita.FechaHora == DateTime.MinValue)
                {
                    cita.FechaHora = DateTime.Now;
                }

                await _citaRepo.Crear(cita);
                return Ok(new { mensaje = "Cita creada correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _citaRepo.Eliminar(id);
            return Ok(new { mensaje = "Cita eliminada" });
        }
    }
}