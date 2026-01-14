using Microsoft.AspNetCore.Mvc;
using Aplication.UseCases; // Tu caso de uso
using Domain.Entities;     // Tus entidades
using Domain.Interfaces;   // Para listar historial
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VentaController : ControllerBase
    {
        private readonly RegistrarVenta _registrarVentaUseCase;
        private readonly IVenta _ventaRepo; // Usamos el repo directo para el historial (GET)

        // Inyectamos el Caso de Uso (para guardar) y el Repo (para leer)
        public VentaController(RegistrarVenta registrarVentaUseCase, IVenta ventaRepo)
        {
            _registrarVentaUseCase = registrarVentaUseCase;
            _ventaRepo = ventaRepo;
        }

        // 1. OBTENER HISTORIAL (GET)
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            // Retorna todas las ventas
            return Ok(await _ventaRepo.ObtenerHistorial()); 
        }

        // 2. REGISTRAR VENTA (POST) - AQUÍ ESTABA EL ERROR 405 (FALTABA ESTO)
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] VentaDto dto)
        {
            try
            {
                // Convertimos lo que manda el Frontend (DTO) a tu Entidad Venta
                var nuevaVenta = new Venta
                {
                    Id = Guid.NewGuid(),
                    Fecha = DateTime.Now,
                    MetodoPago = dto.MetodoPago,
                    Detalles = dto.Productos.Select(p => new DetalleVenta
                    {
                        MedicamentoId = Guid.Parse(p.MedicamentoId),
                        Cantidad = p.Cantidad
                        // El precio y subtotal se calculan en el Caso de Uso o Dominio
                    }).ToList()
                };

                // Guardamos usando tu lógica de negocio
                await _registrarVentaUseCase.Ejecutar(nuevaVenta);

                return Ok(new { mensaje = "Venta registrada correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    // --- CLASES AUXILIARES (DTOs) PARA RECIBIR EL JSON DEL FRONTEND ---
    public class VentaDto
    {
        public string MetodoPago { get; set; }
        public List<ProductoVentaDto> Productos { get; set; }
    }

    public class ProductoVentaDto
    {
        public string MedicamentoId { get; set; }
        public int Cantidad { get; set; }
    }
}