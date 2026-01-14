using Microsoft.AspNetCore.Mvc;
using Aplication.UseCases;
using Domain.Entities;
using System.Threading.Tasks;
using System;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicamentoController : ControllerBase
    {
        private readonly GestionarMedicamentos _gestionar;
        private readonly ControlarStock _controlarStock;

        public MedicamentoController(GestionarMedicamentos gestionar, ControlarStock controlarStock)
        {
            _gestionar = gestionar;
            _controlarStock = controlarStock;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _gestionar.ListarTodos());
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Medicamento medicamento)
        {
            // Usamos "Guardar" que definimos en el Caso de Uso (sirve para crear)
            await _gestionar.Guardar(medicamento);
            return Ok(new { mensaje = "Medicamento guardado" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(Guid id, [FromBody] Medicamento medicamento)
        {
            medicamento.Id = id;
            // CORRECCIÓN 1: Usamos "Guardar" en vez de "Editar" (tu Caso de Uso maneja la actualización dentro de Guardar)
            await _gestionar.Guardar(medicamento);
            return Ok(new { mensaje = "Medicamento actualizado" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _gestionar.Eliminar(id);
            return Ok(new { mensaje = "Medicamento eliminado" });
        }

        // Endpoint para forzar la revisión de stock manual (si quieres probar la alerta)
        [HttpPost("verificar-stock")]
        public async Task<IActionResult> VerificarStock()
        {
            // CORRECCIÓN 2: Llamamos a "Ejecutar" (como está en tu archivo), no "EjecutarAsync"
            await _controlarStock.Ejecutar();
            return Ok(new { mensaje = "Verificación de stock ejecutada. Revisa la consola para alertas." });
        }
    }
}