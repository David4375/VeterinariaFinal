using Aplication.DTOs; // Si usas DTOs
using Aplication.UseCases;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace WebApI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MascotaController : ControllerBase
    {
        private readonly GestionarMascotas _gestionarMascotas; // <--- Nombre correcto

        public MascotaController(GestionarMascotas gestionarMascotas)
        {
            _gestionarMascotas = gestionarMascotas;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _gestionarMascotas.ListarTodas());
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Mascota mascota)
        {
            try
            {
                await _gestionarMascotas.Guardar(mascota);
                return Ok(new { mensaje = "Mascota guardada correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _gestionarMascotas.Eliminar(id);
            return Ok(new { mensaje = "Mascota eliminada" });
        }
    }
}