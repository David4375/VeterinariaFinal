using Domain.Entities;
using Domain.Interfaces;

namespace Aplication.UseCases
{
    public class ObtenerReportes
    {
        private readonly IVenta _ventaRepo;
        private readonly IFactura _facturaRepo;

        public ObtenerReportes(IVenta ventaRepo, IFactura facturaRepo)
        {
            _ventaRepo = ventaRepo;
            _facturaRepo = facturaRepo;
        }

        public async Task<IEnumerable<Venta>> VerVentas() => await _ventaRepo.ObtenerHistorial();
        public async Task<IEnumerable<Factura>> VerFacturas() => await _facturaRepo.ObtenerTodas();
    }
}