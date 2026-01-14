using Aplication.DTOs;
using Aplication.UseCases;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace WebApI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClienteController : ControllerBase
    {
        private readonly GestionarClientes _gestionarClientes;

        public ClienteController(GestionarClientes gestionarClientes)
        {
            _gestionarClientes = gestionarClientes;
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            return Ok(await _gestionarClientes.ListarClientes());
        }

        [HttpPost("registrar-completo")]
        public async Task<IActionResult> Registrar([FromBody] CrearClienteConMascotaDTO datos)
        {
            try
            {
                await _gestionarClientes.CrearClienteConMascota(datos);
                return Ok(new { mensaje = "Cliente y Mascota registrados correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}