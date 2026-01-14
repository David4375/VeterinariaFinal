using Domain.Entities;
using Domain.Interfaces;
using Infraestructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infraestructure.Repositorios
{
    public class ClienteRepositorio : ICliente
    {
        private readonly AppDbContext _context;

        public ClienteRepositorio(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Cliente>> ListarTodos()
        {
            // Incluimos las mascotas para poder contarlas
            return await _context.Clientes.Include(c => c.Mascotas).ToListAsync();
        }

        public async Task Crear(Cliente cliente)
        {
            await _context.Clientes.AddAsync(cliente);
            await _context.SaveChangesAsync();
        }
    }
}