using Aplication.DTOs;
using Aplication.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace WebApI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacturaController : ControllerBase
    {
        private readonly GenerarFactura _generarFactura;

        public FacturaController(GenerarFactura generarFactura)
        {
            _generarFactura = generarFactura;
        }

        [HttpPost("emitir")]
        public async Task<IActionResult> Emitir([FromBody] GenerarFacturaDTO datos)
        {
            try
            {
                var factura = await _generarFactura.EjecutarAsync(datos);
                return Ok(new
                {
                    mensaje = "Factura generada exitosamente",
                    numero = factura.NumeroFactura,
                    total = factura.Total,
                    facturaId = factura.Id
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
        [HttpGet]
        public async Task<IActionResult> Historial([FromServices] ObtenerReportes uc) => Ok(await uc.VerFacturas());
    }
}