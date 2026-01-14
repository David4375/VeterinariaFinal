using Domain.Entities;
using Domain.Interfaces;
using Infraestructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Repositorios
{
    public class FacturaRepositorio : IFactura
    {
        private readonly AppDbContext _context;

        public FacturaRepositorio(AppDbContext context) => _context = context;

        public async Task Crear(Factura factura)
        {
            _context.Facturas.Add(factura);
            await _context.SaveChangesAsync();
        }

        public async Task<Factura?> ObtenerPorVentaId(Guid ventaId)
        {
            return await _context.Facturas.FirstOrDefaultAsync(f => f.VentaId == ventaId);
        }
        public async Task<IEnumerable<Factura>> ObtenerTodas() =>
    await _context.Facturas.OrderByDescending(f => f.FechaEmision).ToListAsync();
    }
}