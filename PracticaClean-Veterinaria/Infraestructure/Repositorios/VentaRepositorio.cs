using Domain.Entities;
using Domain.Interfaces;
using Infraestructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Repositorios
{
    public class VentaRepositorio : IVenta
    {
        private readonly AppDbContext _context;

        public VentaRepositorio(AppDbContext context)
        {
            _context = context;
        }

        public async Task Crear(Venta venta)
        {
            _context.Ventas.Add(venta);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<Venta>> ObtenerHistorial()
        {
            // Usamos Include para traer los detalles (productos vendidos)
            return await _context.Ventas
                .Include(v => v.Detalles)
                .OrderByDescending(v => v.Fecha)
                .ToListAsync();
        }
    }
}