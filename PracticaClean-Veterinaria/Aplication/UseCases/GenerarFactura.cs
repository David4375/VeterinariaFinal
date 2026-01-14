using Aplication.DTOs;
using Aplication.Services; // Ahora sí lo encontrará aquí
using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Threading.Tasks;

namespace Aplication.UseCases
{
    public class GenerarFactura
    {
        private readonly IFactura _facturaRepo;
        // Quitamos AppDbContext porque UseCase no debe conocer la Infraestructura

        public GenerarFactura(IFactura facturaRepo)
        {
            _facturaRepo = facturaRepo;
        }

        public async Task<Factura> EjecutarAsync(GenerarFacturaDTO datos)
        {
            // Validamos que no exista factura previa
            var facturaExistente = await _facturaRepo.ObtenerPorVentaId(datos.VentaId);
            if (facturaExistente != null)
                throw new Exception($"La venta {datos.VentaId} ya tiene factura.");

            // Usamos la Factory (Lógica de aplicación)
            // Nota: Aquí el total debería venir de la consulta de la venta, 
            // pero para compilar ahora usaremos un valor del DTO o simulado.
            var nuevaFactura = FacturaFactory.CrearFactura(
                datos.VentaId,
                100, // Total simulado para pruebas
                datos.ClienteNombre,
                datos.ClienteNit
            );

            await _facturaRepo.Crear(nuevaFactura);
            return nuevaFactura;
        }
    }
}