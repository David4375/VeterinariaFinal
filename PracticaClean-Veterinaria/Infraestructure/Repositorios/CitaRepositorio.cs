using Domain.Entities;
using Domain.Interfaces;
using Infraestructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infraestructure.Repositorios
{
    public class CitaRepositorio : ICita
    {
        private readonly AppDbContext _context;

        public CitaRepositorio(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Cita>> ListarTodas()
        {
            return await _context.Citas
                .OrderByDescending(c => c.FechaHora)
                .ToListAsync();
        }

        public async Task Crear(Cita cita)
        {
            await _context.Citas.AddAsync(cita);
            await _context.SaveChangesAsync();
        }

        public async Task Eliminar(Guid id)
        {
            var cita = await _context.Citas.FindAsync(id);
            if (cita != null)
            {
                _context.Citas.Remove(cita);
                await _context.SaveChangesAsync();
            }
        }

        // --- IMPLEMENTACIÓN DE LOS NUEVOS MÉTODOS ---

        public async Task<Cita?> ObtenerPorId(Guid id)
        {
            return await _context.Citas.FindAsync(id);
        }

        public async Task Actualizar(Cita cita)
        {
            _context.Citas.Update(cita);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExisteCitaEnHorario(DateTime fechaHora)
        {
            // Verifica si ya hay alguna cita agendada exactamente a esa hora
            // (Ignoramos segundos para ser flexibles si quieres)
            return await _context.Citas.AnyAsync(c => c.FechaHora == fechaHora);
        }
    }
}