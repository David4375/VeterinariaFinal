using Domain.Entities;
using Domain.Interfaces;
using Infraestructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Repositorios
{
    public class MedicamentoRepositorio : IMedicamento
    {
        private readonly AppDbContext _context;

        public MedicamentoRepositorio(AppDbContext context) => _context = context;

        public async Task Crear(Medicamento medicamento)
        {
            _context.Medicamentos.Add(medicamento);
            await _context.SaveChangesAsync();
        }

        public async Task<Medicamento?> ObtenerId(Guid id) => await _context.Medicamentos.FindAsync(id);

        public async Task Actualizar(Medicamento medicamento)
        {
            _context.Medicamentos.Update(medicamento);
            await _context.SaveChangesAsync();
        }

        // --- IMPLEMENTACIÓN NUEVA ---
        public async Task<IEnumerable<Medicamento>> ListarTodos()
        {
            return await _context.Medicamentos.ToListAsync();
        }

        public async Task Eliminar(Guid id)
        {
            var medicamento = await _context.Medicamentos.FindAsync(id);
            if (medicamento != null)
            {
                _context.Medicamentos.Remove(medicamento);
                await _context.SaveChangesAsync();
            }
        }
    }
}