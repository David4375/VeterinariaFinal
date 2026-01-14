using Domain.Entities;
using Domain.Interfaces;
using Infraestructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infraestructure.Repositorios
{
    public class MascotaRepositorio : IMascota
    {
        private readonly AppDbContext _context;

        public MascotaRepositorio(AppDbContext context)
        {
            _context = context;
        }

        // IMPLEMENTACIÓN DEL NUEVO MÉTODO
        public async Task<List<Mascota>> ListarTodos()
        {
            // EL .Include ES OBLIGATORIO PARA VER AL DUEÑO
            return await _context.Mascotas
                .Include(m => m.Dueño) 
                .ToListAsync();
        }        

        public async Task Crear(Mascota mascota)
        {
            await _context.Mascotas.AddAsync(mascota);
            await _context.SaveChangesAsync();
        }

        public async Task Actualizar(Mascota mascota)
        {
            _context.Mascotas.Update(mascota);
            await _context.SaveChangesAsync();
        }

        public async Task Eliminar(Guid id)
        {
            var mascota = await _context.Mascotas.FindAsync(id);
            if (mascota != null)
            {
                _context.Mascotas.Remove(mascota);
                await _context.SaveChangesAsync();
            }
        }
    }
}